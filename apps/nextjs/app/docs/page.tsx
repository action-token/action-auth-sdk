import { CodeBlock } from "@/components/code-block";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-4xl font-bold m-0">Getting Started</h1>
        <Badge>v0.1.1</Badge>
      </div>

      <p className="text-xl text-muted-foreground">
        Action Auth SDK provides seamless authentication for Next.js
        applications, supporting both Web2 (social login) and Web3 (Stellar
        wallets) authentication.
      </p>

      <Card className="my-6 bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-sm m-0">
            <strong>Built on Better Auth:</strong> This SDK extends Better Auth
            with Stellar wallet support and provides pre-built React components.
          </p>
        </CardContent>
      </Card>

      <h2>Features</h2>
      <div className="grid gap-3 not-prose">
        <div className="flex items-start gap-2">
          <span className="text-green-500 mt-1">✓</span>
          <span>Multiple auth methods (Social + Stellar wallets)</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-500 mt-1">✓</span>
          <span>Pre-built React components with TypeScript</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-500 mt-1">✓</span>
          <span>JWT authentication with JWKS verification</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-500 mt-1">✓</span>
          <span>Session management with React hooks</span>
        </div>
      </div>

      <h2>Quick Example</h2>

      <CodeBlock
        filename="app/page.tsx"
        code={`import { createAuthClient, AuthModal } from "@action-auth/sdk";
import { useState } from "react";

export const authClient = createAuthClient;

function App() {
  const [open, setOpen] = useState(false);
  const user = authClient.useSession();

  return (
    <div>
      {user ? (
        <div>Welcome, {user.data?.user.email}</div>
      ) : (
        <button onClick={() => setOpen(true)}>Sign In</button>
      )}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}`}
      />

      <h2>Next Steps</h2>
      <div className="grid gap-4 not-prose">
        <Link href="/docs/installation">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-1">Installation</h3>
              <p className="text-sm text-muted-foreground">
                Install the SDK and set up your project
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/docs/quick-start">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-1">Quick Start</h3>
              <p className="text-sm text-muted-foreground">
                Get up and running in 5 minutes
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
