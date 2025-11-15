import { Context } from "hono";
import { jwtVerify, createLocalJWKSet } from "jose";
import { db } from "../db";
import { admins } from "../db/schema/admin-schema";
import { eq } from "drizzle-orm";

// Get the base URL from environment or use default
const BASE_URL = (
  process.env.BETTER_AUTH_URL || "http://localhost:3001"
).replace(/\/$/, "");

// Cache for JWKS
let cachedJWKS: any = null;
let jwksKeySet: any = null;

/**
 * Fetch and cache JWKS from the auth server
 */
async function getJWKS() {
  if (jwksKeySet) {
    return jwksKeySet;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/jwks`);

    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS: ${response.status}`);
    }

    cachedJWKS = await response.json();
    jwksKeySet = createLocalJWKSet(cachedJWKS);
    return jwksKeySet;
  } catch (error) {
    console.error("Failed to fetch JWKS:", error);
    throw error;
  }
}

/**
 * Verify JWT token using JWKS
 */
async function verifyToken(token: string) {
  try {
    const keySet = await getJWKS();
    const { payload } = await jwtVerify(token, keySet, {
      issuer: BASE_URL,
      audience: BASE_URL,
    });
    return payload;
  } catch (error) {
    // If verification fails, try refreshing JWKS (might be a key rotation)
    if ((error as any).code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      jwksKeySet = null;
      cachedJWKS = null;

      try {
        const keySet = await getJWKS();
        const { payload } = await jwtVerify(token, keySet, {
          issuer: BASE_URL,
          audience: BASE_URL,
        });
        return payload;
      } catch (retryError) {
        return null;
      }
    }

    return null;
  }
}

/**
 * Extract and verify JWT token from Authorization header
 */
async function getVerifiedUser(c: Context) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);

  if (!payload || !payload.sub) {
    return null;
  }

  // Return user info from JWT payload
  return {
    id: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string,
  };
}

export async function requireAdmin(c: Context) {
  try {
    // Verify JWT token using JWKS
    const user = await getVerifiedUser(c);

    if (!user) {
      return c.json({ error: "Unauthorized - Please log in" }, 401);
    }

    // Check if user is an admin
    const adminUser = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, user.id))
      .limit(1);

    if (!adminUser || adminUser.length === 0) {
      return c.json({ error: "Forbidden - Admin access required" }, 403);
    }

    // Attach admin info to context for use in routes
    c.set("adminUser", adminUser[0]);
    c.set("user", user);

    return null; // No error, continue
  } catch (error) {
    console.error("Admin auth error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}

export async function requireSuperAdmin(c: Context) {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  const adminUser = c.get("adminUser");
  // if (adminUser.role !== "super_admin") {
  //   return c.json({ error: "Forbidden - Super admin access required" }, 403);
  // }

  return null;
}
