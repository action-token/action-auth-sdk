"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  showLineNumbers = false,
}: {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Use resolvedTheme to handle 'system' preference
  const currentTheme = mounted ? resolvedTheme || theme : "light";
  const isDark = currentTheme === "dark";

  return (
    <div className="relative my-6 overflow-hidden rounded-lg border group">
      {filename && (
        <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
          <span className="text-sm font-mono text-muted-foreground">
            {filename}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
      )}
      <div className="relative">
        {!filename && (
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "absolute right-2 top-2 h-8 w-8 z-10 opacity-0 transition-opacity group-hover:opacity-100",
              "hover:bg-muted-foreground/20"
            )}
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy code</span>
          </Button>
        )}
        {mounted && (
          <SyntaxHighlighter
            language={language}
            style={isDark ? oneDark : oneLight}
            showLineNumbers={showLineNumbers}
            wrapLines={true}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              padding: "1rem",
              fontSize: "0.875rem",
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
        {!mounted && (
          <pre className="overflow-x-auto p-4 text-sm bg-muted">
            <code className="font-mono">{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
