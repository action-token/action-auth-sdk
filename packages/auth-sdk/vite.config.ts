import { defineConfig } from "vite";
import type { Plugin } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// Plugin to inject CSS content into the bundle
function injectCSSPlugin(): Plugin {
  return {
    name: "inject-css-content",
    enforce: "post",

    generateBundle(options, bundle) {
      // Find the CSS file in the bundle
      const cssFileName = Object.keys(bundle).find((name) =>
        name.endsWith(".css")
      );

      if (!cssFileName || bundle[cssFileName].type !== "asset") {
        console.log("[inject-css-content] No CSS file found!");
        return;
      }

      const cssContent = bundle[cssFileName].source as string;
      console.log(
        `[inject-css-content] Found CSS file: ${cssFileName} (${cssContent.length} chars)`
      );

      // Find the JS files and inject CSS
      Object.keys(bundle).forEach((fileName) => {
        if (fileName.endsWith(".js") || fileName.endsWith(".cjs")) {
          const chunk = bundle[fileName];
          if (chunk.type === "chunk") {
            const before = chunk.code;

            // Replace the placeholder with actual CSS
            chunk.code = chunk.code.replace(
              /const allStyles = "";/g,
              `const allStyles = ${JSON.stringify(cssContent)};`
            );

            if (chunk.code !== before) {
              console.log(
                `[inject-css-content] ✓ Injected CSS into ${fileName}`
              );
            } else {
              console.log(
                `[inject-css-content] ✗ Pattern not found in ${fileName}`
              );
            }
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/**/*"],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.css"],
      rollupTypes: false,
      insertTypesEntry: true,
    }),
    injectCSSPlugin(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ActionAuthSDK",
      formats: ["es", "cjs"],
      fileName: (format) => {
        if (format === "es") return "index.js";
        if (format === "cjs") return "index.cjs";
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "better-auth",
        "@creit.tech/stellar-wallets-kit",
        "stellar-sdk",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "index.css";
          return assetInfo.name!;
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    emptyOutDir: true,
    assetsInlineLimit: 10240, // Inline assets < 10KB as base64 for Shadow DOM
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
});
