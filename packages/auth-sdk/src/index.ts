// packages/auth-sdk/src/index.ts
export { authClient as createAuthClient } from "./client/auth-client";
export { AuthModal } from "./components/AuthModal";
export { ConnectModal } from "./components/auth/ConnectModal";
export { Button } from "./components/ui/button";

// Export helpers
export * from "./lib/stellar";
export { stellarClient } from "./client/plugins/stellar-client";

// Export types
// export type * from "./types";
