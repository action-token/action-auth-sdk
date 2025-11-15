# Admin System Setup Guide

## Overview

The admin system allows you to manage:

- **Projects**: Register applications that can use the auth service
- **Allowed Origins**: Control which domains are allowed in CORS
- **Admins**: Manage who has access to the admin panel

## Initial Setup

### 1. Run Database Migration

First, apply the new database schema:

```bash
cd apps/server
npx drizzle-kit push
```

This will create the following tables:

- `admin` - Admin users
- `project` - Registered projects
- `allowed_origin` - Allowed CORS origins

### 2. Create Your First Admin

Manually insert your first admin into the database:

```sql
-- First, sign up as a regular user through the auth system
-- Then find your user ID and insert into admins table

INSERT INTO admin (id, userId, email, role, addedBy, createdAt)
VALUES (
  'admin_' || lower(hex(randomblob(16))),  -- Generate random ID
  'YOUR_USER_ID_HERE',                      -- Your user ID from user table
  'your-email@example.com',                 -- Your email
  'super_admin',                            -- Role
  NULL,                                     -- First admin has no creator
  unixepoch()                               -- Current timestamp
);
```

**Steps:**

1. Sign up using email/password or Google OAuth
2. Query the `user` table to find your user ID
3. Run the INSERT query above with your user ID

### 3. Access Admin Panel

Navigate to `/admin` in your Next.js app. You'll be redirected to login if not authenticated.

## Admin Panel Features

### Dashboard (`/admin`)

- View stats (total projects, origins, etc.)
- Quick navigation to projects and admins

### Projects (`/admin/projects`)

- List all registered projects
- Create new projects
- Toggle project status (active/suspended)
- View/manage origins per project
- Delete projects

### Project Detail (`/admin/projects/[projectId]`)

- Add allowed origins (URLs)
- Toggle origin active/inactive
- Set environment (production, staging, development)
- Delete origins

### Admins (`/admin/admins`)

- List all admin users
- Add new admins (requires super_admin role)
- Assign roles (admin or super_admin)
- Remove admin access

## Roles

### Admin

- View all projects and origins
- Create/edit/delete projects
- Add/remove origins
- **Cannot** add or remove other admins

### Super Admin

- All admin permissions
- Can add new admins
- Can remove admins
- Can promote admins to super_admin

## API Endpoints

All admin endpoints are protected and require authentication.

### Admin Management

- `GET /api/admin/check` - Check if current user is admin
- `GET /api/admin/admins` - List all admins
- `POST /api/admin/admins` - Add new admin (super_admin only)
- `DELETE /api/admin/admins/:id` - Remove admin (super_admin only)

### Project Management

- `GET /api/admin/projects` - List all projects
- `GET /api/admin/projects/:id` - Get project details
- `POST /api/admin/projects` - Create project
- `PATCH /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

### Origin Management

- `POST /api/admin/origins` - Add origin to project
- `PATCH /api/admin/origins/:id` - Toggle origin active status
- `DELETE /api/admin/origins/:id` - Delete origin

### Utility

- `GET /api/admin/stats` - Get dashboard statistics

## Environment Variables

No additional environment variables needed. The system uses your existing auth configuration.

## CORS Integration

Once you add origins through the admin panel, you need to update your CORS middleware to read from the database instead of hardcoded values.

### Current (Hardcoded)

```typescript
// apps/server/src/index.ts
const allowedOrigins = ["https://example.com", "https://another.com"];
```

### Updated (Database-driven)

```typescript
// Load from database
import { db } from "./db";
import { allowedOrigins, projects } from "./db/schema";
import { eq } from "drizzle-orm";

async function loadAllowedOrigins() {
  const origins = await db
    .select({ origin: allowedOrigins.origin })
    .from(allowedOrigins)
    .innerJoin(projects, eq(projects.id, allowedOrigins.projectId))
    .where(eq(allowedOrigins.isActive, true))
    .where(eq(projects.status, "active"));

  return origins.map((o) => o.origin);
}

// Cache and refresh periodically
let originsCache: string[] = [];
loadAllowedOrigins().then((origins) => (originsCache = origins));

// In CORS middleware
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (originsCache.includes(origin)) {
        return origin;
      }
      return false;
    },
  })
);
```

## Security Notes

1. **Admin Authentication**: All admin routes check if the user is in the `admin` table
2. **Role-Based Access**: Super admin actions require `role = 'super_admin'`
3. **Origin Validation**: URLs are validated before being added to the database
4. **Project Status**: Suspended projects' origins are ignored in CORS
5. **Active Toggle**: Individual origins can be temporarily disabled without deletion

## Troubleshooting

### "Forbidden - Admin access required"

- Ensure you're logged in
- Check that your user exists in the `admin` table
- Verify the `userId` matches your logged-in user

### "User not found" when adding admin

- The user must sign up through the regular auth flow first
- They must have an entry in the `user` table

### Origins not working in CORS

- Ensure the origin is marked as `isActive = true`
- Check that the parent project has `status = 'active'`
- Verify your CORS middleware is reading from the database

## Next Steps

1. ✅ Create your first admin
2. ✅ Add your first project
3. ✅ Add allowed origins to the project
4. ✅ Update CORS middleware to use database origins
5. ✅ Test authentication from your registered origins
