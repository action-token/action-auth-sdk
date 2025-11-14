import { CodeBlock } from "@/components/code-block";

export default function AuthModalPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">AuthModal Component</h1>
      <p className="text-lg text-gray-600 mb-6">
        A pre-built modal component for handling authentication with support for
        social login, email/password, and Stellar wallet connections.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Basic Usage</h2>
      <p className="mb-4">
        Import and use the <code>AuthModal</code> component in your app:
      </p>

      <CodeBlock
        code={`"use client";

import { AuthModal } from "@action-auth/sdk";
import { useState } from "react";

export function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Sign In
      </button>
      
      <AuthModal 
        open={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Props</h2>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Prop
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Required
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                open
              </td>
              <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                boolean
              </td>
              <td className="border border-gray-300 px-4 py-2">Yes</td>
              <td className="border border-gray-300 px-4 py-2">
                Controls whether the modal is visible
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                onClose
              </td>
              <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                () =&gt; void
              </td>
              <td className="border border-gray-300 px-4 py-2">Yes</td>
              <td className="border border-gray-300 px-4 py-2">
                Callback fired when the modal should close
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                client
              </td>
              <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                AuthClient
              </td>
              <td className="border border-gray-300 px-4 py-2">No</td>
              <td className="border border-gray-300 px-4 py-2">
                Custom auth client instance (uses default if not provided)
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                callbackURL
              </td>
              <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                string
              </td>
              <td className="border border-gray-300 px-4 py-2">No</td>
              <td className="border border-gray-300 px-4 py-2">
                URL to redirect to after successful authentication
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Features</h2>
      <p className="mb-4">
        The <code>AuthModal</code> provides a complete authentication UI with:
      </p>

      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>
          Multiple authentication views (sign in, sign up, forgot password)
        </li>
        <li>Stellar wallet connection (Albedo, xBull, Lobstr)</li>
        <li>Social login integration</li>
        <li>Email/password authentication</li>
        <li>Password reset flow</li>
        <li>Success confirmations</li>
        <li>Error handling and validation</li>
        <li>Loading states</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">Custom Auth Client</h2>
      <p className="mb-4">
        You can pass a custom auth client instance if needed:
      </p>

      <CodeBlock
        code={`import { createAuthClient, AuthModal } from "@action-auth/sdk";

// Create custom auth client with additional config
const customClient = createAuthClient({
  // custom configuration
});

export function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <AuthModal 
      open={open} 
      onClose={() => setOpen(false)}
      client={customClient}
    />
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">With Callback URL</h2>
      <p className="mb-4">
        Specify where users should be redirected after authentication:
      </p>

      <CodeBlock
        code={`<AuthModal 
  open={open} 
  onClose={() => setOpen(false)}
  callbackURL="https://yourapp.com/dashboard"
/>`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Styling</h2>
      <p className="mb-4">
        The <code>AuthModal</code> uses Shadow DOM for style encapsulation,
        ensuring it won't conflict with your application styles. It includes
        default styling that works well with most applications.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="text-blue-900">
          <strong>Note:</strong> Custom theming options will be available in a
          future release. For now, the modal uses the default Action Auth
          styling.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Authentication Flow</h2>
      <p className="mb-4">The modal handles the following flows:</p>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold mb-2">1. Connect View (Default)</h4>
          <p className="text-sm text-gray-600">
            Shows wallet connection options (Albedo, xBull, Lobstr) and tabs to
            switch to sign in/sign up
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold mb-2">2. Sign In View</h4>
          <p className="text-sm text-gray-600">
            Email/password login with social login options and "forgot password"
            link
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold mb-2">3. Sign Up View</h4>
          <p className="text-sm text-gray-600">
            New user registration with email/password and social signup options
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold mb-2">4. Forgot Password View</h4>
          <p className="text-sm text-gray-600">Password reset request form</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold mb-2">5. Reset Password View</h4>
          <p className="text-sm text-gray-600">
            Set new password with reset token
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold mb-2">6. Success View</h4>
          <p className="text-sm text-gray-600">
            Confirmation message after successful authentication
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Complete Example</h2>

      <CodeBlock
        code={`"use client";

import { authClient } from "@/lib/auth-client";
import { AuthModal } from "@action-auth/sdk";
import { useState } from "react";

export function LoginButton() {
  const [open, setOpen] = useState(false);
  const session = authClient.useSession();

  if (session.data) {
    return (
      <div>
        <p>Welcome, {session.data.user.email}!</p>
        <button onClick={() => authClient.signOut()}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Sign In / Connect Wallet
      </button>
      
      <AuthModal 
        open={open} 
        onClose={() => setOpen(false)}
        callbackURL={window.location.origin}
      />
    </>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Next Steps</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/docs/components/connect-modal"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">ConnectModal →</h3>
          <p className="text-gray-600 text-sm">
            Learn about the wallet-only connection modal
          </p>
        </a>
        <a
          href="/docs/auth/stellar"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Stellar Wallets →</h3>
          <p className="text-gray-600 text-sm">
            Deep dive into Stellar wallet authentication
          </p>
        </a>
      </div>
    </div>
  );
}
