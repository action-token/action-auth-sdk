import { ThemeToggle } from "@/components/theme-toggle";
import { DocsSidebar } from "@/components/docs-sidebar";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container flex h-14 items-center justify-end px-8 gap-2">
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
        </header>
        <main className="container px-8 py-8">
          <div className="max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
