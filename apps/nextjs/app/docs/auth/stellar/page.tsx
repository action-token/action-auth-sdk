import { CodeBlock } from "@/components/code-block";

export default function StellarAuthPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Stellar Wallet Authentication</h1>
      <p className="text-lg text-gray-600 mb-6">
        Authenticate users with their Stellar wallets using Albedo, xBull, or
        Lobstr.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Supported Wallets</h2>
      <p className="mb-4">
        Action Auth SDK supports the following Stellar wallet providers:
      </p>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">🌐 Albedo</h3>
          <p className="text-sm text-gray-600">
            Web-based signing service with no installation required
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">🐂 xBull</h3>
          <p className="text-sm text-gray-600">
            Browser extension wallet with advanced features
          </p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">🦞 Lobstr</h3>
          <p className="text-sm text-gray-600">
            Mobile and web wallet with simple interface
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">How It Works</h2>
      <p className="mb-4">
        Stellar wallet authentication uses cryptographic signatures to verify
        wallet ownership:
      </p>

      <ol className="list-decimal list-inside space-y-2 mb-8">
        <li>User clicks "Connect Wallet" and selects their wallet provider</li>
        <li>SDK requests a signature from the wallet</li>
        <li>User approves the signature in their wallet app</li>
        <li>SDK verifies the signature on the server</li>
        <li>Server creates a session and issues a JWT token</li>
        <li>User is authenticated and can access protected resources</li>
      </ol>

      <h2 className="text-2xl font-bold mb-4 mt-8">Using the AuthModal</h2>
      <p className="mb-4">
        The easiest way to implement Stellar wallet authentication is with the{" "}
        <code>AuthModal</code> component:
      </p>

      <CodeBlock
        code={`"use client";

import { AuthModal } from "@action-auth/sdk";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function WalletAuth() {
  const [open, setOpen] = useState(false);
  const session = authClient.useSession();

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Connect Wallet
      </button>
      
      <AuthModal open={open} onClose={() => setOpen(false)} />
      
      {session.data?.user.stellarPublicKey && (
        <p>Connected: {session.data.user.stellarPublicKey}</p>
      )}
    </>
  );
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Manual Wallet Connection</h2>
      <p className="mb-4">
        You can also implement wallet connection manually using the SDK helpers:
      </p>

      <CodeBlock
        code={`import { 
  signInWithAlbedo, 
  signInWithXBull, 
  signInWithLobstr 
} from "@action-auth/sdk";

// Connect with Albedo
const connectAlbedo = async () => {
  try {
    const result = await signInWithAlbedo();
    console.log("Connected:", result);
  } catch (error) {
    console.error("Connection failed:", error);
  }
};

// Connect with xBull
const connectXBull = async () => {
  try {
    const result = await signInWithXBull();
    console.log("Connected:", result);
  } catch (error) {
    console.error("Connection failed:", error);
  }
};

// Connect with Lobstr
const connectLobstr = async () => {
  try {
    const result = await signInWithLobstr();
    console.log("Connected:", result);
  } catch (error) {
    console.error("Connection failed:", error);
  }
};`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Network Configuration</h2>
      <p className="mb-4">
        The SDK is configured to work with the Stellar mainnet by default. The
        network configuration is handled automatically.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="text-blue-900">
          <strong>Network:</strong> Stellar Mainnet (Public Network)
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Accessing Wallet Data</h2>
      <p className="mb-4">
        Once authenticated, you can access the user's Stellar public key from
        the session:
      </p>

      <CodeBlock
        code={`const session = authClient.useSession();

if (session.data) {
  // Get the Stellar public key
  const publicKey = session.data.user.stellarPublicKey;
  
  // Use it for Stellar transactions
  console.log("Public Key:", publicKey);
  
  // Get other user info
  console.log("User ID:", session.data.user.id);
  console.log("Email:", session.data.user.email);
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Error Handling</h2>
      <p className="mb-4">Common errors when connecting wallets:</p>

      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>
          <strong>Wallet not installed:</strong> User needs to install the
          wallet extension
        </li>
        <li>
          <strong>User rejected:</strong> User declined the signature request
        </li>
        <li>
          <strong>Network error:</strong> Connection issue with the auth server
        </li>
        <li>
          <strong>Invalid signature:</strong> Signature verification failed
        </li>
      </ul>

      <CodeBlock
        code={`try {
  await signInWithXBull();
} catch (error) {
  if (error.message.includes("not installed")) {
    alert("Please install xBull wallet extension");
  } else if (error.message.includes("rejected")) {
    alert("You rejected the connection request");
  } else {
    alert("Connection failed: " + error.message);
  }
}`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Security</h2>
      <p className="mb-4">Wallet authentication is secure by design:</p>

      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>No private keys are ever shared or stored</li>
        <li>Users sign a unique challenge message for each login</li>
        <li>Signatures are verified server-side using Stellar cryptography</li>
        <li>Sessions are managed with secure JWT tokens</li>
        <li>All communication happens over HTTPS</li>
      </ul>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-8">
        <p className="text-yellow-900">
          <strong>Important:</strong> Users should always verify they're
          connecting to your legitimate application before signing any messages.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Best Practices</h2>

      <ol className="list-decimal list-inside space-y-2 mb-8">
        <li>Always provide clear instructions for users</li>
        <li>Handle wallet installation prompts gracefully</li>
        <li>Show loading states during connection</li>
        <li>Display the connected public key to users</li>
        <li>Provide an easy way to disconnect</li>
        <li>Test with all three wallet providers</li>
      </ol>

      <h2 className="text-2xl font-bold mb-4 mt-8">Next Steps</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/docs/auth/social"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Social Login →</h3>
          <p className="text-gray-600 text-sm">
            Learn about OAuth social authentication
          </p>
        </a>
        <a
          href="/docs/examples"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Examples →</h3>
          <p className="text-gray-600 text-sm">
            See wallet authentication in action
          </p>
        </a>
      </div>
    </div>
  );
}
