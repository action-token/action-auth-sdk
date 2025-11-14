"use client";

import { authClient } from "@/lib/auth-client";
import { AuthModal } from "@action-auth/sdk";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import Link from "next/link";
import { ArrowLeft, User, Mail, Key, Loader2 } from "lucide-react";

export default function DemoPage() {
  const [open, setOpen] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const session = authClient.useSession();

  const handleGetToken = async () => {
    const tokenResult = await authClient.token();
    if (tokenResult.data) {
      setToken(tokenResult.data.token);
      setShowToken(true);
    }
  };

  const handleApiCall = async () => {
    const tokenResult = await authClient.token();
    if (tokenResult.data) {
      const jwtToken = tokenResult.data.token;

      try {
        const response = await fetch("/api/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          console.error("API call failed:", response.statusText);
          return;
        }

        const data = await response.json();
        console.log("Protected API response:", data);
        alert("API call successful! Check console for response.");
      } catch (error) {
        console.error("API call error:", error);
        alert("API call failed. Check console for details.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/demo",
      });
      console.log("Login initiated");
    } catch (error) {
      console.error("Login error:", error);
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      setShowToken(false);
      setToken(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-bold">Live Demo</h1>
          </div>
          <Badge variant="secondary">Interactive Playground</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Try Action Auth SDK</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test the authentication flow with real social login and Stellar
            wallet connections
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Interactive Demo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Authentication Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.data ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                        ✓ Authenticated
                      </p>
                      <div className="space-y-2 text-sm">
                        {session.data.user.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span
                              className="truncate"
                              title={session.data.user.email}
                            >
                              {session.data.user.email.length > 30
                                ? `${session.data.user.email.substring(
                                    0,
                                    30
                                  )}...`
                                : session.data.user.email}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            ID: {session.data.user.id.substring(0, 12)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleGetToken}
                        className="flex-1"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Get JWT Token
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleApiCall}
                        className="flex-1"
                      >
                        Test Protected API
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      onClick={handleSignOut}
                      className="w-full"
                      disabled={isSigningOut}
                    >
                      {isSigningOut && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Not authenticated. Choose a method to sign in:
                      </p>
                    </div>

                    <Button
                      onClick={() => setOpen(true)}
                      className="w-full"
                      size="lg"
                    >
                      Open Auth Modal (All Methods)
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or try direct
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleGoogleLogin}
                      variant="outline"
                      className="w-full"
                      disabled={isSigningIn}
                    >
                      {isSigningIn && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {isSigningIn ? "Signing in..." : "Sign in with Google"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* JWT Token Display */}
            {showToken && token && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    JWT Token
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                      {token}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        navigator.clipboard.writeText(token);
                        alert("Token copied to clipboard!");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This token can be used to authenticate API requests
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Session Data */}
            {session.data && (
              <Card>
                <CardHeader>
                  <CardTitle>Session Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(session.data, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Code Examples */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Happening</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Using AuthModal</h4>
                  <CodeBlock
                    code={`import { AuthModal } from "@action-auth/sdk";

const [open, setOpen] = useState(false);

<AuthModal 
  open={open} 
  onClose={() => setOpen(false)} 
/>`}
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">2. Social Login</h4>
                  <CodeBlock
                    code={`authClient.signIn.social({
  provider: "google",
  callbackURL: window.location.origin
});`}
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">3. Get Session</h4>
                  <CodeBlock
                    code={`const session = authClient.useSession();

if (session.data) {
  console.log(session.data.user);
}`}
                  />
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">4. Protected API Call</h4>
                  <CodeBlock
                    code={`const token = await authClient.token();

fetch("/api/protected", {
  headers: {
    Authorization: \`Bearer \${token.data.token}\`
  }
});`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">💡 Tip</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="mb-2">
                  Open your browser's console to see authentication events and
                  API responses in real-time.
                </p>
                <p>
                  Try both social login and wallet authentication to see how
                  seamlessly they work together!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
