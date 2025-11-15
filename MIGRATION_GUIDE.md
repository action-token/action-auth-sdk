# Migration Guide: Cookie-Based to Bearer Token Authentication

## Overview

This guide will help you migrate from cookie-based authentication with `sameSite: "None"` to secure bearer token authentication.

## Why Migrate?

- ✅ Third-party cookies are being deprecated by browsers
- ✅ Better mobile/native app support
- ✅ Stateless architecture for better scalability
- ✅ Eliminates CORS cookie complexity
- ✅ Standard OAuth 2.0 pattern

## Changes Made

### 1. Server Configuration (`apps/server/src/auth/index.ts`)

```diff
- import { jwt } from "better-auth/plugins";
+ import { jwt, bearer } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    jwt(),
+   bearer(),
    stellar(...)
  ],

- advanced: {
-   defaultCookieAttributes: {
-     sameSite: "None",
-     secure: true,
-   },
- },
});
```

### 2. Client Configuration (`packages/auth-sdk/src/client/auth-client.ts`)

```diff
export function createClient(options?: { baseURL?: string }) {
  return createAuthClient({
    baseURL: options?.baseURL,
    plugins: [stellarClient(), jwtClient()],
+   fetchOptions: {
+     auth: {
+       type: "Bearer",
+       token: () => localStorage.getItem("bearer_token") || "",
+     },
+     onSuccess: (ctx) => {
+       const token = ctx.response.headers.get("set-auth-token");
+       if (token) localStorage.setItem("bearer_token", token);
+     },
+     onError: (ctx) => {
+       if (ctx.response.status === 401) {
+         localStorage.removeItem("bearer_token");
+       }
+     },
+   },
  });
}
```

## Testing the Changes

### 1. Test Authentication Flow

```typescript
// Test login
const result = await authClient.signIn.email({
  email: "test@example.com",
  password: "password",
});

// Check localStorage
const token = localStorage.getItem("bearer_token");
console.log("Token stored:", !!token);
```

### 2. Test Session Retrieval

```typescript
const session = await authClient.getSession();
console.log("Session:", session);
```

### 3. Test Protected API Calls

```typescript
// Your JWT verification should still work
const response = await fetch("/api/protected", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("bearer_token")}`,
  },
});
```

### 4. Test Token Expiration Handling

```typescript
// Remove token to simulate expiration
localStorage.removeItem("bearer_token");

// Try to access protected resource
const session = await authClient.getSession();
// Should return null or redirect to login
```

## For Existing Users

### Option 1: Seamless Migration (Recommended)

Support both methods during transition period:

```typescript
// Server-side: Check both cookie and bearer token
export async function authenticate(request: Request) {
  // Try bearer token first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return verifyBearerToken(authHeader.substring(7));
  }

  // Fallback to cookie session
  return await auth.api.getSession({ headers: request.headers });
}
```

### Option 2: Force Re-authentication

```typescript
// Client-side: Clear old sessions on app load
useEffect(() => {
  const migrateAuth = async () => {
    // Check if we have a bearer token
    const hasBearerToken = !!localStorage.getItem("bearer_token");

    if (!hasBearerToken) {
      // Force sign out and re-authenticate
      await authClient.signOut();
      // Redirect to login
    }
  };

  migrateAuth();
}, []);
```

## Deployment Strategy

### Phase 1: Deploy Server Changes (Day 0)

1. Deploy auth server with `bearer` plugin
2. Keep existing cookie auth working
3. Monitor for issues

### Phase 2: Deploy Client Changes (Day 1-7)

1. Update SDK to use bearer tokens
2. Publish new SDK version
3. Test with one consuming project

### Phase 3: Update All Projects (Day 7-14)

1. Roll out SDK updates to all projects
2. Monitor authentication metrics
3. Handle any edge cases

### Phase 4: Remove Cookie Config (Day 14+)

1. Verify all projects using bearer tokens
2. Remove `advanced.defaultCookieAttributes`
3. Clean up any cookie-specific code

## Troubleshooting

### Token Not Being Stored

**Issue**: `localStorage.getItem("bearer_token")` returns null

**Solutions**:

1. Check browser console for errors
2. Verify `set-auth-token` header in network tab
3. Ensure HTTPS in production (localStorage requires secure context)

```typescript
// Debug token storage
authClient.signIn.email(
  { email, password },
  {
    onSuccess: (ctx) => {
      console.log(
        "Response headers:",
        Array.from(ctx.response.headers.entries())
      );
    },
  }
);
```

### CORS Issues

**Issue**: CORS errors when accessing auth server

**Solution**: Ensure auth server CORS config includes requesting origin

```typescript
// apps/server/src/index.ts
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Your origin validation logic
      return origin || "*";
    },
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["set-auth-token"], // Important!
  })
);
```

### Token Verification Fails

**Issue**: Backend rejects valid tokens

**Solution**: Verify JWKS endpoint is accessible

```typescript
// Test JWKS endpoint
const response = await fetch("https://your-auth-server.com/api/auth/jwks");
const jwks = await response.json();
console.log("JWKS:", jwks);
```

### Mobile App Issues

**Issue**: Token not persisting on mobile

**Solution**: Use secure storage instead of localStorage

```typescript
// React Native example
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: async () => {
        return (await SecureStore.getItemAsync("bearer_token")) || "";
      },
    },
    onSuccess: async (ctx) => {
      const token = ctx.response.headers.get("set-auth-token");
      if (token) {
        await SecureStore.setItemAsync("bearer_token", token);
      }
    },
  },
});
```

## Rollback Plan

If issues arise, you can quickly rollback:

### 1. Server Rollback

```typescript
// Remove bearer plugin
export const auth = betterAuth({
  plugins: [
    jwt(),
    // bearer(), // Remove this
    stellar(...)
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "None",
      secure: true,
    },
  },
});
```

### 2. Client Rollback

```typescript
// Remove bearer config
export function createClient(options?: { baseURL?: string }) {
  return createAuthClient({
    baseURL: options?.baseURL,
    plugins: [stellarClient(), jwtClient()],
    // Remove fetchOptions
  });
}
```

## Verification Checklist

- [ ] Server deployed with `bearer` plugin
- [ ] Client deployed with bearer token storage
- [ ] Login flow works correctly
- [ ] Token stored in localStorage
- [ ] Session retrieval works
- [ ] Protected API calls succeed
- [ ] Token refresh works (if implemented)
- [ ] Logout clears token
- [ ] Mobile apps tested (if applicable)
- [ ] All consuming projects updated
- [ ] Old cookie config removed
- [ ] Documentation updated

## Support

If you encounter issues during migration:

1. Check network tab for `set-auth-token` header
2. Verify token in localStorage
3. Test JWKS endpoint accessibility
4. Review CORS configuration
5. Check browser console for errors

For questions, refer to:

- `SECURITY_ANALYSIS.md` - Detailed security rationale
- Better Auth docs: https://better-auth.com/docs/plugins/bearer
- Better Auth docs: https://better-auth.com/docs/plugins/jwt
