import { CodeBlock } from "@/components/code-block";

export default function ExamplesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Examples</h1>
      <p className="text-lg text-gray-600 mb-6">
        Real-world examples showing how to use Action Auth SDK in different
        scenarios.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">1. Basic Authentication</h2>
      <p className="mb-4">Simple login/logout with session display:</p>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";
import { AuthModal } from "@action-auth/sdk";
import { useState } from "react";

export function BasicAuth() {
  const [open, setOpen] = useState(false);
  const session = authClient.useSession();

  return (
    <div className="p-8">
      {session.data ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Welcome back!
          </h2>
          <p>Email: {session.data.user.email}</p>
          <p>User ID: {session.data.user.id}</p>
          <button 
            onClick={() => authClient.signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Please sign in
          </h2>
          <button 
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Sign In / Connect Wallet
          </button>
        </div>
      )}
      
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">2. Social Login Only</h2>
      <p className="mb-4">
        Implement Google/GitHub login without showing the modal:
      </p>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";

export function SocialLogin() {
  const session = authClient.useSession();

  const handleGoogleLogin = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    }).catch(console.error);
  };

  const handleGitHubLogin = () => {
    authClient.signIn.social({
      provider: "github",
      callbackURL: window.location.origin,
    }).catch(console.error);
  };

  if (session.data) {
    return <p>Logged in as {session.data.user.email}</p>;
  }

  return (
    <div className="flex gap-4">
      <button 
        onClick={handleGoogleLogin}
        className="px-4 py-2 bg-white border rounded flex items-center gap-2"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
      
      <button 
        onClick={handleGitHubLogin}
        className="px-4 py-2 bg-gray-900 text-white rounded flex items-center gap-2"
      >
        <GitHubIcon />
        Sign in with GitHub
      </button>
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">3. Protected Dashboard</h2>
      <p className="mb-4">Create a dashboard that requires authentication:</p>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";
import { AuthModal } from "@action-auth/sdk";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const session = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!session.isPending && !session.data) {
      setOpen(true);
    }
  }, [session]);

  if (session.isPending) {
    return <div>Loading...</div>;
  }

  if (!session.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AuthModal open={open} onClose={() => router.push("/")} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {session.data.user.email}!</p>
      
      {/* Your protected content here */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Your Data</h2>
        {/* ... */}
      </div>
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">
        4. API Call with Authentication
      </h2>
      <p className="mb-4">Fetch data from a protected API endpoint:</p>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProtectedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get JWT token
      const tokenResponse = await authClient.token();
      
      if (!tokenResponse.data) {
        throw new Error("No token available");
      }

      // Make authenticated API call
      const response = await fetch("/api/protected", {
        headers: {
          Authorization: \`Bearer \${tokenResponse.data.token}\`,
        },
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={fetchProtectedData}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>

      {error && (
        <div className="p-4 bg-red-50 text-red-900 rounded">
          Error: {error}
        </div>
      )}

      {data && (
        <div className="p-4 bg-green-50 rounded">
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">
        5. Wallet Connection Flow
      </h2>
      <p className="mb-4">
        Let users connect their Stellar wallet and display their public key:
      </p>

      <CodeBlock
        code={`"use client";

import { AuthModal } from "@action-auth/sdk";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function WalletConnect() {
  const [open, setOpen] = useState(false);
  const session = authClient.useSession();

  // Extract Stellar public key from session if available
  const publicKey = session.data?.user.stellarPublicKey;

  return (
    <div className="p-8">
      {publicKey ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Wallet Connected</h2>
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-sm font-mono break-all">
              {publicKey}
            </p>
          </div>
          <button 
            onClick={() => authClient.signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Connect with Albedo, xBull, or Lobstr
          </p>
          <button 
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Connect Wallet
          </button>
        </div>
      )}
      
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">6. Conditional Rendering</h2>
      <p className="mb-4">
        Show different content based on authentication status:
      </p>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";
import { AuthModal } from "@action-auth/sdk";
import { useState } from "react";

export function ConditionalContent() {
  const [open, setOpen] = useState(false);
  const session = authClient.useSession();

  if (session.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Public content - always visible */}
      <section className="p-8">
        <h1 className="text-3xl font-bold">Public Content</h1>
        <p>This is visible to everyone</p>
      </section>

      {/* Protected content - only for authenticated users */}
      {session.data ? (
        <section className="p-8 bg-green-50">
          <h2 className="text-2xl font-bold">Premium Content</h2>
          <p>This is only visible to authenticated users</p>
          <p>Logged in as: {session.data.user.email}</p>
        </section>
      ) : (
        <section className="p-8 bg-gray-50">
          <h2 className="text-2xl font-bold">
            Sign in to view premium content
          </h2>
          <button 
            onClick={() => setOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Sign In
          </button>
        </section>
      )}
      
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">More Examples</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/docs/examples/protected-routes"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Protected Routes →</h3>
          <p className="text-gray-600 text-sm">
            Learn how to protect entire routes with middleware
          </p>
        </a>
        <a
          href="/docs/examples/styling"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Custom Styling →</h3>
          <p className="text-gray-600 text-sm">
            Customize the look and feel of auth components
          </p>
        </a>
      </div>
    </div>
  );
}
