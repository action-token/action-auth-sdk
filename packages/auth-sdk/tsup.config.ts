import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "better-auth",
    "@creit.tech/stellar-wallets-kit",
    "stellar-sdk",
  ],
  // esbuildOptions(options) {
  //   // Preserve CSS module imports as-is
  //   options.loader = {
  //     ...options.loader,
  //     ".css": "css",
  //   };
  // },
  splitting: false,
  // Don't use CSS loader - let it be handled by import
});
