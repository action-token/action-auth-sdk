# Quick Start - Admin System

## 🚀 Get Started in 3 Steps

### Step 1: Create First Admin (1 minute)

```bash
# 1. Sign up via your app first (email/password or Google)
# Visit: http://localhost:3000 and create an account

# 2. Find your user ID
cd apps/server
bun run drizzle-kit studio

# Or query directly:
# SELECT id, email FROM user WHERE email = 'your-email@example.com';

# 3. Insert admin record
# In Drizzle Studio or SQL:
INSERT INTO admin (id, userId, email, role, addedBy, createdAt)
VALUES (
  'admin_' || lower(hex(randomblob(16))),
  'user_YOUR_ID_HERE',  -- Replace with your user ID
  'your-email@example.com',
  'super_admin',
  NULL,
  unixepoch()
);
```

---

### Step 2: Access Admin Panel (30 seconds)

Visit: **http://localhost:3000/admin**

You should see:

- Dashboard with stats
- Navigation to Projects and Admins

---

### Step 3: Add Your First Project (1 minute)

1. Click **"Projects"**
2. Click **"Add Project"**
3. Fill in:
   - Name: `My App`
   - Owner Email: `owner@example.com` (optional)
4. Click **"Create Project"**
5. Click on your project name
6. Click **"Add Origin"**
7. Add: `http://localhost:3000`
8. Click **"Add Origin"**

Done! ✅

---

## 📝 What to Do Next

### Update CORS to Use Database Origins

Edit `apps/server/src/index.ts`:

```typescript
import { db } from "./db";
import { allowedOrigins as allowedOriginsTable, projects } from "./db/schema";
import { eq, and } from "drizzle-orm";

// Add this function
async function loadAllowedOrigins() {
  const origins = await db
    .select({ origin: allowedOriginsTable.origin })
    .from(allowedOriginsTable)
    .innerJoin(projects, eq(projects.id, allowedOriginsTable.projectId))
    .where(
      and(eq(allowedOriginsTable.isActive, true), eq(projects.status, "active"))
    );
  return origins.map((o) => o.origin);
}

// Add this before app.use("*", cors(...))
let originsCache: string[] = [];
loadAllowedOrigins().then((origins) => {
  originsCache = origins;
  console.log(`Loaded ${origins.length} origins from database`);
});

// Update your CORS origin function
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow localhost
      if (origin?.startsWith("http://localhost:")) {
        return origin;
      }

      // Check database origins
      if (origin && originsCache.includes(origin)) {
        return origin;
      }

      // Allow Vercel
      if (origin?.endsWith(".vercel.app")) {
        return origin;
      }

      return false;
    },
    // ... rest of your CORS config
  })
);
```

Restart your server and test!

---

## 🧪 Quick Test

1. **Test Admin Access:**

   - Visit `/admin` while logged in → Should work
   - Log out and visit `/admin` → Should redirect

2. **Test Project Management:**

   - Create a project
   - Add an origin
   - Toggle it inactive/active

3. **Test CORS:**
   - Make a request from your allowed origin
   - Should work! ✅

---

## 📚 Full Documentation

- **Setup Guide:** `ADMIN_SETUP.md`
- **Implementation Details:** `ADMIN_IMPLEMENTATION.md`
- **Security Analysis:** `SECURITY_ANALYSIS.md`

---

## 🆘 Troubleshooting

**Can't access /admin?**

- Make sure you're logged in
- Check your user exists in `admin` table
- Verify userId matches your logged-in user

**"User not found" when adding admin?**

- The person must sign up first
- They need an account in the `user` table

**Origins not working in CORS?**

- Check origin is marked `isActive = true`
- Check project has `status = 'active'`
- Restart server after adding origins (or implement refresh)

---

## ✨ You're All Set!

You now have:

- ✅ Admin panel access
- ✅ Project management
- ✅ Dynamic CORS control
- ✅ Team member management

**Next:** Start adding your production domains! 🚀
