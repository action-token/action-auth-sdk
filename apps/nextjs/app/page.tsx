import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Wallet, Code, Github } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(0,0,0,0))]"></div>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Action Auth</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/docs">Documentation</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/action-token/action-auth-sdk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 mt-12">
          <Badge className="mb-6 px-4 py-1.5 text-sm" variant="secondary">
            <span className="mr-2">🎉</span> v0.1.1 - Latest Release
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            Action Auth SDK
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Seamless <span className="font-semibold text-foreground">Web2</span>{" "}
            & <span className="font-semibold text-foreground">Web3</span>{" "}
            authentication for Next.js applications
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/docs">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-8"
            >
              <Link href="/docs/examples">View Examples</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader>
              <Shield className="h-10 w-10 mb-3 text-primary" />
              <CardTitle className="text-lg">Multiple Auth Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Social login (Google, GitHub) and Stellar wallets (Albedo,
                xBull, Lobstr)
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader>
              <Zap className="h-10 w-10 mb-3 text-primary" />
              <CardTitle className="text-lg">Easy Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Drop-in React components with full TypeScript support and
                minimal config
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader>
              <Wallet className="h-10 w-10 mb-3 text-primary" />
              <CardTitle className="text-lg">Web3 Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Native Stellar blockchain integration with wallet signature
                authentication
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <CardHeader>
              <Code className="h-10 w-10 mb-3 text-primary" />
              <CardTitle className="text-lg">Secure by Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                JWT tokens with JWKS verification, built on top of Better Auth
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Code Preview */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Quick Start</CardTitle>
              <Badge variant="outline">TypeScript</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <CodeBlock
              language="typescript"
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
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link href="/docs/installation">
                  View Full Installation Guide{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="mt-20 mb-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold mb-2">3+</div>
            <div className="text-sm text-muted-foreground">Stellar Wallets</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">2+</div>
            <div className="text-sm text-muted-foreground">
              Social Providers
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-sm text-muted-foreground">TypeScript</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">JWT</div>
            <div className="text-sm text-muted-foreground">Secure Tokens</div>
          </div>
        </div>
      </main>
    </div>
  );
}
