import { CodeBlock } from "@/components/code-block";

export default function ClientSetupPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Client Setup</h1>
      <p className="text-lg text-gray-600 mb-6">
        Configure the authentication client for your Next.js application.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Basic Setup</h2>
      <p className="mb-4">
        The simplest way to set up the auth client is to use the default
        configuration:
      </p>

      <CodeBlock
        code={`// lib/auth-client.ts
import { createAuthClient } from "@action-auth/sdk";

export const authClient = createAuthClient;`}
      />

      <p className="mt-4 mb-4">
        This creates an auth client that connects to the Action Auth server with
        all necessary plugins pre-configured.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">What's Included</h2>
      <p className="mb-4">
        The default auth client includes the following plugins:
      </p>

      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>
          <strong>stellarClient()</strong> - Stellar wallet authentication
          (Albedo, xBull, Lobstr)
        </li>
        <li>
          <strong>jwtClient()</strong> - JWT token management for API calls
        </li>
        <li>
          <strong>Better Auth</strong> - Social login providers (Google, GitHub,
          etc.)
        </li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">Using the Client</h2>
      <p className="mb-4">Import and use the auth client in your components:</p>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";

export function MyComponent() {
  // Get current session
  const session = authClient.useSession();
  
  // Get JWT token for API calls
  const getToken = async () => {
    const token = await authClient.token();
    return token.data?.token;
  };

  return (
    <div>
      {session.data ? (
        <p>Logged in as: {session.data.user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Available Methods</h2>

      <h3 className="text-xl font-semibold mb-3 mt-6">useSession()</h3>
      <p className="mb-4">
        React hook that returns the current user session. Automatically updates
        when the session changes.
      </p>

      <CodeBlock
        code={`const session = authClient.useSession();

// Access user data
if (session.data) {
  console.log(session.data.user.email);
  console.log(session.data.user.id);
  console.log(session.data.user.name);
}`}
      />

      <h3 className="text-xl font-semibold mb-3 mt-6">signIn.social()</h3>
      <p className="mb-4">
        Sign in with OAuth providers like Google or GitHub:
      </p>

      <CodeBlock
        code={`await authClient.signIn.social({
  provider: "google",
  callbackURL: "http://localhost:3000",
});

// Or with GitHub
await authClient.signIn.social({
  provider: "github",
  callbackURL: "http://localhost:3000",
});`}
      />

      <h3 className="text-xl font-semibold mb-3 mt-6">signOut()</h3>
      <p className="mb-4">Sign out the current user:</p>

      <CodeBlock code={`await authClient.signOut();`} />

      <h3 className="text-xl font-semibold mb-3 mt-6">token()</h3>
      <p className="mb-4">Get a JWT token for authenticated API calls:</p>

      <CodeBlock
        code={`const tokenResponse = await authClient.token();

if (tokenResponse.data) {
  const jwtToken = tokenResponse.data.token;
  
  // Use in API calls
  const response = await fetch("/api/protected", {
    headers: {
      Authorization: \`Bearer \${jwtToken}\`,
    },
  });
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">TypeScript Support</h2>
      <p className="mb-4">
        The auth client is fully typed. Your IDE will provide autocomplete for
        all methods and properties:
      </p>

      <CodeBlock
        code={`import type { AuthClient } from "@action-auth/sdk";

// The client is fully typed
const session = authClient.useSession();
//    ^? { data: { user: User } | null, isPending: boolean, error: Error | null }

// Type-safe user data
if (session.data) {
  const email: string = session.data.user.email;
  const id: string = session.data.user.id;
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Error Handling</h2>
      <p className="mb-4">Always handle errors when calling auth methods:</p>

      <CodeBlock
        code={`try {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "http://localhost:3000",
  });
} catch (error) {
  console.error("Login failed:", error);
  // Show error message to user
}`}
      />

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-8">
        <p className="text-blue-900">
          <strong>Tip:</strong> The auth client handles token refresh
          automatically. You don't need to manually refresh tokens.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Next Steps</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/docs/components/auth-modal"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Auth Components →</h3>
          <p className="text-gray-600 text-sm">
            Learn about the AuthModal and other UI components
          </p>
        </a>
        <a
          href="/docs/server-setup"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Server Setup →</h3>
          <p className="text-gray-600 text-sm">
            Configure authentication on the server side
          </p>
        </a>
      </div>
    </div>
  );
}
