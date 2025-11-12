// This function fetches the bundled CSS at runtime
let cachedCSS: string | null = null;

export async function getAuthModalCSS(): Promise<string> {
  if (cachedCSS) return cachedCSS;

  try {
    // Try to fetch the CSS from the package
    const response = await fetch(
      new URL("../../dist/index.css", import.meta.url).href
    );
    if (response.ok) {
      cachedCSS = await response.text();
      return cachedCSS;
    }
  } catch (e) {
    console.warn("Failed to fetch CSS, will use inline styles", e);
  }

  // Fallback: return empty string if CSS can't be loaded
  return "";
}

// Inline CSS content as fallback - this will be replaced during build
export const inlineCSS = `
/* Fallback inline CSS - will be replaced with actual bundled CSS */
.auth-container * {
  box-sizing: border-box;
}
`;
