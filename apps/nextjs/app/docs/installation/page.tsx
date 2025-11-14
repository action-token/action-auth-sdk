import { CodeBlock } from "@/components/code-block";

export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Installation</h1>
      <p className="text-lg text-gray-600 mb-6">
        Learn how to install and configure the Action Auth SDK in your Next.js
        project.
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Prerequisites</h2>
      <p className="mb-4">Before you begin, make sure you have:</p>
      <ul className="list-disc list-inside space-y-2 mb-8">
        <li>Node.js 18+ installed</li>
        <li>A Next.js 14+ project (App Router)</li>
        <li>React 18+ installed</li>
      </ul>

      <h2 className="text-2xl font-bold mb-4 mt-8">Install the Package</h2>
      <p className="mb-4">Install the Action Auth SDK from GitHub releases:</p>

      <CodeBlock
        language="bash"
        code={`npm install https://github.com/action-token/action-auth-sdk/releases/download/v0.1.1/action-auth-sdk-0.1.1.tgz`}
      />

      <p className="mt-4 mb-4">Or with yarn:</p>

      <CodeBlock
        language="bash"
        code={`yarn add https://github.com/action-token/action-auth-sdk/releases/download/v0.1.1/action-auth-sdk-0.1.1.tgz`}
      />

      <p className="mt-4 mb-4">Or with bun:</p>

      <CodeBlock
        language="bash"
        code={`bun add https://github.com/action-token/action-auth-sdk/releases/download/v0.1.1/action-auth-sdk-0.1.1.tgz`}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">
        Install Peer Dependencies
      </h2>
      <p className="mb-4">
        The SDK requires the following peer dependencies. If you don't have them
        already, install them:
      </p>

      <CodeBlock
        language="bash"
        code={`npm install better-auth @creit.tech/stellar-wallets-kit jose`}
      />

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-8">
        <p className="text-yellow-900">
          <strong>Note:</strong> The SDK uses Better Auth for authentication
          backend. You'll need to set up a Better Auth server separately (or use
          our hosted solution).
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Verify Installation</h2>
      <p className="mb-4">
        Verify the installation by importing the SDK in your project:
      </p>

      <CodeBlock
        code={`import { createAuthClient, AuthModal } from "@action-auth/sdk";

console.log("Action Auth SDK installed successfully!");`}
      />

      <p className="mt-6 mb-4">
        If the import works without errors, you're ready to proceed to the next
        step!
      </p>

      <h2 className="text-2xl font-bold mb-4 mt-8">Package Structure</h2>
      <p className="mb-4">The package includes:</p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
        <ul className="space-y-2 text-sm font-mono">
          <li>
            <strong>createAuthClient</strong> - Function to create auth client
            instance
          </li>
          <li>
            <strong>AuthModal</strong> - Main authentication modal component
          </li>
          <li>
            <strong>ConnectModal</strong> - Wallet connection modal
          </li>
          <li>
            <strong>stellarClient</strong> - Stellar wallet integration plugin
          </li>
          <li>
            <strong>Button</strong> - Pre-styled button component
          </li>
          <li>
            <strong>Types & Icons</strong> - TypeScript types and icon
            components
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8">Next Steps</h2>
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <a
          href="/docs/client-setup"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Client Setup →</h3>
          <p className="text-gray-600 text-sm">
            Configure the auth client in your Next.js app
          </p>
        </a>
        <a
          href="/docs/quick-start"
          className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg mb-2">Quick Start →</h3>
          <p className="text-gray-600 text-sm">
            Follow a step-by-step guide to get started
          </p>
        </a>
      </div>
    </div>
  );
}
