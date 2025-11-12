// packages/auth-sdk/src/index.ts

// Import styles to ensure they're bundled
import "./components/styles";

export { authClient as createAuthClient } from "./client/auth-client";
export { AuthModal } from "./components/AuthModal";
export { ConnectModal } from "./components/auth/ConnectModal";
export { Button } from "./components/ui/button";
export { ShadowDOMPortal } from "./components/ShadowDOMPortal";

// Export helpers
export * from "./lib/stellar";
export { stellarClient } from "./client/plugins/stellar-client";

// Export types
// export type * from "./types";
