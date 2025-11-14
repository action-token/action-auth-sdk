import { CodeBlock } from "@/components/code-block";

export default function QuickStartPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
      <p className="text-lg text-gray-600 mb-6">
        Get started with Action Auth SDK in 5 minutes. This guide will walk you
        through creating a complete authentication flow.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">
        Step 1: Create Auth Client
      </h2>
      <p className="mb-4">
        Create a new file <code>lib/auth-client.ts</code> in your Next.js
        project:
      </p>

      <CodeBlock
        code={`// lib/auth-client.ts
import { createAuthClient } from "@action-auth/sdk";

export const authClient = createAuthClient;`}
      />

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="text-blue-900">
          The auth client is pre-configured to connect to the Action Auth
          server. No additional configuration needed!
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">
        Step 2: Create Login Component
      </h2>
      <p className="mb-4">
        Create a client component for authentication. Create{" "}
        <code>app/login.tsx</code>:
      </p>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";
import { AuthModal } from "@action-auth/sdk";
import { useState } from "react";

export function Login() {
  const [open, setOpen] = useState(false);
  const user = authClient.useSession();

  const handleSocialLogin = () => {
    authClient.signIn
      .social({
        provider: "google",
        callbackURL: "http://localhost:3000",
      })
      .then((result) => {
        console.log("Login successful:", result);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.data?.user.email}!</p>
          <button onClick={() => authClient.signOut()}>
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <button onClick={handleSocialLogin}>
            Sign in with Google
          </button>
          <button onClick={() => setOpen(true)}>
            Connect Wallet
          </button>
        </div>
      )}
      
      {/* Wallet Connection Modal */}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Step 3: Use in Your Page</h2>
      <p className="mb-4">
        Import and use the Login component in your page. Update{" "}
        <code>app/page.tsx</code>:
      </p>

      <CodeBlock
        code={`import { Login } from "./login";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">My App</h1>
        <Login />
      </main>
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">
        Step 4: Protect API Routes (Optional)
      </h2>
      <p className="mb-4">
        To protect your API routes, create a protected route handler. Create{" "}
        <code>app/api/protected/route.ts</code>:
      </p>

      <CodeBlock
        code={`import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const BASE_URL =
  "https://zg5nz4f7pbvxlgeycnuwjpy2cy0bigya.lambda-url.us-east-2.on.aws";

const JWKS = createRemoteJWKSet(new URL(\`\${BASE_URL}/api/auth/jwks\`));

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: BASE_URL,
      audience: BASE_URL,
    });

    return NextResponse.json({
      message: "Access granted",
      user: payload,
    });
  } catch (error) {
    console.error("Token validation failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">
        Step 5: Call Protected API
      </h2>
      <p className="mb-4">
        Now you can call your protected API from the client:
      </p>

      <CodeBlock
        code={`const handleApiCall = async () => {
  const token = await authClient.token();
  
  if (token.data) {
    const response = await fetch("/api/protected", {
      method: "GET",
      headers: {
        Authorization: \`Bearer \${token.data.token}\`,
      },
    });

    const data = await response.json();
    console.log("Protected data:", data);
  }
};`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Test It Out!</h2>
      <p className="mb-4">Run your development server:</p>

      <CodeBlock language="bash" code={`npm run dev`} />

      <p className="mt-4 mb-4">
        Visit <code>http://localhost:3000</code> and try:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>Signing in with Google</li>
        <li>Connecting a Stellar wallet (Albedo, xBull, or Lobstr)</li>
        <li>Calling the protected API route</li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-8">
        <p className="text-green-900">
          <strong>Success!</strong> You now have a fully functional
          authentication system with both Web2 and Web3 support.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Next Steps</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/docs/components/auth-modal"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Components →</h3>
          <p className="text-gray-600 text-sm">
            Learn about available components and their props
          </p>
        </a>
        <a
          href="/docs/auth/social"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Authentication →</h3>
          <p className="text-gray-600 text-sm">
            Explore different authentication methods
          </p>
        </a>
      </div>
    </div>
  );
}
