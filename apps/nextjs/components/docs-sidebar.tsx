"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "Setup",
    items: [
      { title: "Client Setup", href: "/docs/client-setup" },
      { title: "Server Setup", href: "/docs/server-setup" },
    ],
  },
  {
    title: "Authentication",
    items: [{ title: "Stellar Wallets", href: "/docs/auth/stellar" }],
  },
  {
    title: "Components",
    items: [{ title: "AuthModal", href: "/docs/components/auth-modal" }],
  },
  {
    title: "Resources",
    items: [
      { title: "Examples", href: "/docs/examples" },
      { title: "Live Demo", href: "/demo" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2 mb-6">
          <span className="font-bold text-xl">Action Auth</span>
        </Link>
        <nav className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-2 text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 text-sm rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-secondary text-secondary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
