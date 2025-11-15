import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_AUTH_URL || "";

/**
 * Make an authenticated API call using Bearer token (like demo page)
 */
export async function authenticatedFetch(
  endpoint: string,
  options?: RequestInit
) {
  // Get JWT token first
  const tokenResult = await authClient.token();

  if (!tokenResult.data) {
    throw new Error("No authentication token available");
  }

  const jwtToken = tokenResult.data.token;

  // Make API call with Bearer token
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });

  return response;
}
