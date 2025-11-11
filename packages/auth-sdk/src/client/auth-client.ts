"use client";
import { createAuthClient } from "better-auth/react";
import { stellarClient } from "./plugins/stellar-client";
import { BASE_URL } from "../lib/utils";
import { jwtClient } from "better-auth/client/plugins";

// Configure Better Auth client. Set VITE_AUTH_BASE_URL in your .env to point to your auth server.
// Fallback to "/api/auth" which is the common default proxy path.
const baseURL =
  ((import.meta as any).env?.VITE_AUTH_BASE_URL as string | undefined) ??
  BASE_URL;

export const AUTH_BASE_URL = baseURL;

export type AuthClient = ReturnType<typeof createAuthClient>;

export function createClient(options?: { baseURL?: string }) {
  return createAuthClient({
    baseURL: options?.baseURL,
    plugins: [stellarClient(), jwtClient()],
  });
}

export const authClient = createClient({ baseURL });
