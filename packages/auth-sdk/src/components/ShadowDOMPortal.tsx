import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ShadowDOMPortalProps {
  children: React.ReactNode;
  css?: string;
}

export function ShadowDOMPortal({ children, css }: ShadowDOMPortalProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Create the host element
    const host = document.createElement("div");
    host.id = "action-auth-shadow-host";
    document.body.appendChild(host);
    hostRef.current = host;

    // Attach shadow DOM
    const shadowRoot = host.attachShadow({ mode: "open" });
    shadowRootRef.current = shadowRoot;

    // Create a container inside shadow DOM for React to render into
    const container = document.createElement("div");
    container.id = "shadow-root-container";
    shadowRoot.appendChild(container);

    // Inject CSS if provided
    if (css) {
      const style = document.createElement("style");
      style.textContent = css;
      shadowRoot.appendChild(style);
    }

    setMounted(true);

    // Cleanup
    return () => {
      if (hostRef.current && hostRef.current.parentNode) {
        hostRef.current.parentNode.removeChild(hostRef.current);
      }
    };
  }, [css]);

  // Don't render until shadow DOM is ready
  if (!mounted || !shadowRootRef.current) {
    return null;
  }

  // Find the container inside shadow root
  const container = shadowRootRef.current.querySelector(
    "#shadow-root-container"
  );

  if (!container) {
    return null;
  }

  // Render children into the shadow DOM container
  return createPortal(children, container as HTMLElement);
}
