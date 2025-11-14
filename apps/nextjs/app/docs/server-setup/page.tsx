import { CodeBlock } from "@/components/code-block";

export default function ServerSetupPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Server Setup</h1>
      <p className="text-lg text-gray-600 mb-6">
        Configure server-side authentication and protect your API routes with
        JWT verification.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Overview</h2>
      <p className="mb-4">
        The Action Auth SDK uses JWT tokens for secure API authentication. The
        auth server issues tokens that can be verified using JWKS (JSON Web Key
        Set).
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="text-blue-900">
          <strong>Auth Server URL:</strong> The SDK connects to a hosted Better
          Auth server at:
          <br />
          <code className="text-sm">
            https://zg5nz4f7pbvxlgeycnuwjpy2cy0bigya.lambda-url.us-east-2.on.aws
          </code>
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Install Dependencies</h2>
      <p className="mb-4">
        You'll need <code>jose</code> for JWT verification in Next.js API
        routes:
      </p>

      <CodeBlock language="bash" code={`npm install jose`} />

      <h2 className="text-2xl font-bold mb-4 mt-8">
        Create a Protected API Route
      </h2>
      <p className="mb-4">
        Here's how to create a protected API route that verifies JWT tokens:
      </p>

      <CodeBlock
        code={`// app/api/protected/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const BASE_URL =
  "https://zg5nz4f7pbvxlgeycnuwjpy2cy0bigya.lambda-url.us-east-2.on.aws";

const JWKS = createRemoteJWKSet(new URL(\`\${BASE_URL}/api/auth/jwks\`));

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: BASE_URL,
      audience: BASE_URL,
    });

    // Token is valid, return protected data
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

      <h2 className="text-2xl font-bold mb-4 mt-8">Call from Client</h2>
      <p className="mb-4">
        Use the auth client to get a token and call your protected API:
      </p>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";

export function MyComponent() {
  const handleApiCall = async () => {
    // Get JWT token
    const token = await authClient.token();
    
    if (!token.data) {
      console.error("No token available");
      return;
    }

    // Call protected API
    const response = await fetch("/api/protected", {
      method: "GET",
      headers: {
        Authorization: \`Bearer \${token.data.token}\`,
      },
    });

    if (!response.ok) {
      console.error("API call failed:", response.statusText);
      return;
    }

    const data = await response.json();
    console.log("Protected data:", data);
  };

  return (
    <button onClick={handleApiCall}>
      Call Protected API
    </button>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">JWT Payload Structure</h2>
      <p className="mb-4">
        The verified JWT token contains the following user information:
      </p>

      <CodeBlock
        code={`{
  "sub": "user_id",           // User ID
  "email": "user@example.com", // User email
  "name": "John Doe",          // User name (if available)
  "iat": 1234567890,           // Issued at timestamp
  "exp": 1234567890,           // Expiration timestamp
  "iss": "...",                // Issuer (auth server URL)
  "aud": "..."                 // Audience (auth server URL)
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">
        Middleware Protection (Optional)
      </h2>
      <p className="mb-4">
        You can also protect routes using Next.js middleware:
      </p>

      <CodeBlock
        code={`// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const BASE_URL =
  "https://zg5nz4f7pbvxlgeycnuwjpy2cy0bigya.lambda-url.us-east-2.on.aws";

const JWKS = createRemoteJWKSet(new URL(\`\${BASE_URL}/api/auth/jwks\`));

export async function middleware(request: NextRequest) {
  // Check for token
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const token = authHeader.substring(7);
    await jwtVerify(token, JWKS, {
      issuer: BASE_URL,
      audience: BASE_URL,
    });
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: "/api/protected/:path*",
};`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Error Handling</h2>
      <p className="mb-4">Common JWT verification errors:</p>

      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>
          <strong>JWTExpired:</strong> Token has expired, user needs to
          re-authenticate
        </li>
        <li>
          <strong>JWSSignatureVerificationFailed:</strong> Invalid signature,
          token may be tampered
        </li>
        <li>
          <strong>JWTClaimValidationFailed:</strong> Invalid issuer or audience
        </li>
      </ul>

      <CodeBlock
        code={`try {
  await jwtVerify(token, JWKS, { issuer: BASE_URL, audience: BASE_URL });
} catch (error) {
  if (error.code === "ERR_JWT_EXPIRED") {
    return NextResponse.json(
      { error: "Token expired" },
      { status: 401 }
    );
  }
  
  return NextResponse.json(
    { error: "Invalid token" },
    { status: 401 }
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Security Best Practices</h2>

      <div className="space-y-4 mb-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-900">
            <strong>Always use HTTPS:</strong> JWT tokens should only be
            transmitted over HTTPS in production.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-900">
            <strong>Validate issuer and audience:</strong> Always verify the{" "}
            <code>iss</code> and <code>aud</code> claims match your auth server.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-900">
            <strong>Handle token expiration:</strong> Implement proper error
            handling for expired tokens.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Next Steps</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/docs/auth/jwt"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">JWT Details →</h3>
          <p className="text-gray-600 text-sm">
            Learn more about JWT tokens and token management
          </p>
        </a>
        <a
          href="/docs/examples/protected-routes"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Examples →</h3>
          <p className="text-gray-600 text-sm">
            See complete examples of protected routes
          </p>
        </a>
      </div>
    </div>
  );
}
