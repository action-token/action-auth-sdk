import { resolve } from "path";
import type { Plugin } from "vite";

export function injectCSSPlugin(): Plugin {
  return {
    name: "inject-css-string",
    writeBundle(options, bundle) {
      // Find the generated CSS file
      const cssFile = Object.keys(bundle).find((file) => file.endsWith(".css"));

      if (cssFile && bundle[cssFile] && "source" in bundle[cssFile]) {
        const cssContent = (bundle[cssFile] as any).source as string;

        // Escape the CSS content for embedding in a JS string
        const escapedCSS = cssContent
          .replace(/\\/g, "\\\\")
          .replace(/`/g, "\\`")
          .replace(/\$/g, "\\$");

        // Generate the bundled-css.ts file
        const generatedCode = `// Auto-generated file containing bundled CSS for Shadow DOM
export const bundledCSS = \`${escapedCSS}\`;
`;

        // Write to the dist folder
        const outputPath = resolve(options.dir || "dist", "lib/bundled-css.js");

        const fs = require("fs");
        const path = require("path");

        // Ensure directory exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, generatedCode, "utf-8");

        console.log("✓ Generated bundled CSS file for Shadow DOM");
      }
    },
  };
}
