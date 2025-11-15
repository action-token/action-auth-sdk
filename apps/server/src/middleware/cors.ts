import { db } from "../db";
import { allowedOrigins as allowedOriginsTable } from "../db/schema/admin-schema";
import { eq } from "drizzle-orm";

// Cache for allowed origins from database
let cachedOrigins: string[] = [];
let lastFetch = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Fetch allowed origins from database with caching
 */
async function getAllowedOrigins(): Promise<string[]> {
  const now = Date.now();

  // Return cached origins if still valid
  if (cachedOrigins.length > 0 && now - lastFetch < CACHE_TTL) {
    return cachedOrigins;
  }

  try {
    // Fetch all active origins from database
    const origins = await db
      .select({ origin: allowedOriginsTable.origin })
      .from(allowedOriginsTable)
      .where(eq(allowedOriginsTable.isActive, true));

    cachedOrigins = origins.map((o) => o.origin);
    lastFetch = now;

    return cachedOrigins;
  } catch (error) {
    console.error("Failed to fetch allowed origins from database:", error);
    // Return cached origins if database fetch fails
    return cachedOrigins;
  }
}

/**
 * CORS origin validator
 * Checks if the origin is allowed based on:
 * - Development (localhost/127.0.0.1)
 * - Vercel preview deployments
 * - Database allowed origins
 */
export async function validateOrigin(
  origin: string | undefined
): Promise<string | undefined> {
  // Allow all localhost ports for development
  if (
    origin?.startsWith("http://localhost:") ||
    origin?.startsWith("http://127.0.0.1:")
  ) {
    return origin;
  }

  // Fetch allowed origins from database
  const allowedOrigins = await getAllowedOrigins();

  // Allow all Vercel preview deployments
  if (origin?.endsWith(".vercel.app")) {
    return origin;
  }

  // Check if origin is in allowed list from database
  if (origin && allowedOrigins.includes(origin)) {
    return origin;
  }

  // Default: return the origin (or return false to block)
  return origin || "*";
}
