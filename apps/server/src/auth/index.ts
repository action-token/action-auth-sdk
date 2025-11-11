import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { db } from "../db"; // your drizzle instance
import { stellar } from "./plugins/stellar";
import { jwt } from "better-auth/plugins";
// import { expo } from "@better-auth/expo";

// Custodial server service
class CustodialService {
  private static baseUrl = "https://accounts.action-tokens.com";

  static async getOrCreatePublicKey(
    email: string,
    userId: string
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/pub?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error(`Custodial server error: ${response.status}`);
      }

      const data = await response.json();
      return data.publicKey; // Expected: "G..." format
    } catch (error) {
      console.error("Failed to get custodial public key:", error);
      throw error;
    }
  }
}

export const auth = betterAuth({
  // Register Stellar plugin (minimal SEP-10)
  plugins: [
    // expo(),
    jwt(),
    stellar({
      network: (process.env.STELLAR_NETWORK as any) || "TESTNET",
      serverSecret: process.env.STELLAR_SERVER_SECRET as string,
      webAuthDomain: process.env.WEB_AUTH_DOMAIN as string,
      homeDomain: process.env.HOME_DOMAIN as string,
      emailDomainName: process.env.EMAIL_DOMAIN_NAME || "stellar.local",
      challengeTTL: 300,
    }),
  ],
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),

  // Extend user table with Stellar-specific fields
  user: {
    additionalFields: {
      stellarPublicKey: {
        type: "string",
        required: false,
        input: false, // Don't allow user to set this directly
      },
      isCustodial: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },

  // Extend session table with login-specific data
  session: {
    additionalFields: {
      loginType: {
        type: "string",
        required: false,
        input: false, // Don't allow direct input
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      console.log("Auth hook triggered for path:", ctx.path);

      // Only run for specific auth endpoints
      if (
        ctx.path === "/stellar/verify" ||
        ctx.path.startsWith("/callback/") || // Google/social login callback
        ctx.path === "/sign-up/email" ||
        ctx.path === "/sign-in/email"
      ) {
        try {
          const session = ctx.context.newSession;
          if (session?.user?.id) {
            const userId = session.user.id;
            const email = session.user.email;

            let loginType: string;
            let publicKey: string;
            let isCustodial = false;

            if (ctx.path === "/stellar/verify") {
              // Direct Stellar wallet login
              const body = ctx.body as any;
              publicKey = body.account;

              // Use wallet_type directly from the request body
              loginType = body.wallet_type || "stellar"; // fallback to generic if not provided
              isCustodial = false;
            } else if (ctx.path.startsWith("/callback/")) {
              // Social login callback (Google, etc.)
              // Extract provider from path: /callback/google -> google
              const provider = ctx.path.split("/")[2] || "unknown";
              loginType = provider;
              isCustodial = true;

              // Get custodial public key
              if (email) {
                publicKey = await CustodialService.getOrCreatePublicKey(
                  email,
                  userId
                );
              } else {
                throw new Error("No email found for social login");
              }
            } else {
              // Email/password login
              loginType = "emailPass";
              isCustodial = true;

              // Get custodial public key
              if (email) {
                publicKey = await CustodialService.getOrCreatePublicKey(
                  email,
                  userId
                );
              } else {
                throw new Error("No email found for email/password login");
              }
            }

            // Store data in proper user and session fields
            await ctx.context.internalAdapter.updateUser(userId, {
              stellarPublicKey: publicKey,
              isCustodial,
            });

            // Update session with loginType
            if (ctx.context.newSession?.session?.id) {
              await ctx.context.internalAdapter.updateSession(
                ctx.context.newSession.session.id,
                {
                  loginType,
                }
              );
            }

            // Link custodial accounts to Better-auth for consistency
            if (isCustodial) {
              const existingLink =
                await ctx.context.internalAdapter.findAccountByProviderId(
                  publicKey,
                  "stellar-custodial"
                );

              if (!existingLink) {
                await ctx.context.internalAdapter.linkAccount({
                  userId,
                  providerId: "stellar-custodial",
                  accountId: publicKey,
                  scope: "custodial",
                });
              }
            }

            console.log(
              `User ${userId} logged in via ${loginType} with Stellar key: ${publicKey}`
            );
          }
        } catch (error) {
          console.error("Hook failed to process login:", error);
          // Don't throw - allow auth to continue even if this fails
        }
      }
    }),
  },
  trustedOrigins: [
    "myapp://",
    "http://localhost:8081",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://10.12.24.55:3000",
    "https://92049f4cfa12.ngrok-free.app",
    "https://ce01979be39f.ngrok-free.app",
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "None", // Use "None" for cross-origin
      secure: true,
      // httpOnly: true,
      // path: "/",
      // partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
});
