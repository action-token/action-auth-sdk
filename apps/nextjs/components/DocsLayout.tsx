"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  {
    title: "Getting Started",
    links: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "Setup",
    links: [
      { title: "Client Setup", href: "/docs/client-setup" },
      { title: "Server Setup", href: "/docs/server-setup" },
      { title: "Environment Variables", href: "/docs/environment" },
    ],
  },
  {
    title: "Components",
    links: [
      { title: "AuthModal", href: "/docs/components/auth-modal" },
      { title: "ConnectModal", href: "/docs/components/connect-modal" },
      { title: "Hooks", href: "/docs/components/hooks" },
    ],
  },
  {
    title: "Authentication",
    links: [
      { title: "Social Login", href: "/docs/auth/social" },
      { title: "Stellar Wallets", href: "/docs/auth/stellar" },
      { title: "JWT Tokens", href: "/docs/auth/jwt" },
    ],
  },
  {
    title: "API Reference",
    links: [
      { title: "Auth Client", href: "/docs/api/auth-client" },
      { title: "Methods", href: "/docs/api/methods" },
      { title: "Types", href: "/docs/api/types" },
    ],
  },
  {
    title: "Examples",
    links: [
      { title: "Basic Usage", href: "/docs/examples" },
      { title: "Protected Routes", href: "/docs/examples/protected-routes" },
      { title: "Custom Styling", href: "/docs/examples/styling" },
    ],
  },
];

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">
              Action Auth SDK
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/action-token/action-auth-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Sidebar */}
          <aside
            className={`${
              mobileMenuOpen ? "block" : "hidden"
            } lg:block w-64 shrink-0`}
          >
            <nav className="space-y-8">
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`block rounded-md px-3 py-2 text-sm transition ${
                            pathname === link.href
                              ? "bg-indigo-50 text-indigo-600 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-indigo max-w-none">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
