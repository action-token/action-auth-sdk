import { Hono } from "hono";
import { db } from "../db";
import { admins, projects, allowedOrigins } from "../db/schema/admin-schema";
import { user } from "../db/schema/auth-schema";
import { requireAdmin, requireSuperAdmin } from "../middleware/admin-auth";
import { eq, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

const adminRoutes = new Hono();

// Helper to generate IDs
const generateId = (prefix: string) => {
  return `${prefix}_${randomBytes(16).toString("hex")}`;
};

// Check if user is admin (for client-side checks)
adminRoutes.get("/check", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  const adminUser: any = (c as any).get("adminUser");
  return c.json({
    isAdmin: true,
    role: adminUser.role,
    email: adminUser.email,
  });
});

// ============= ADMIN MANAGEMENT =============

// List all admins
adminRoutes.get("/admins", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const adminsList = await db
      .select({
        id: admins.id,
        email: admins.email,
        role: admins.role,
        createdAt: admins.createdAt,
      })
      .from(admins)
      .orderBy(desc(admins.createdAt));

    return c.json({ admins: adminsList });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return c.json({ error: "Failed to fetch admins" }, 500);
  }
});

// Add new admin (super admin only)
adminRoutes.post("/admins", async (c) => {
  const authError = await requireSuperAdmin(c);
  if (authError) return authError;

  try {
    const body = await c.req.json();
    const { email, role = "admin" } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    if (role !== "admin" && role !== "super_admin") {
      return c.json({ error: "Invalid role" }, 400);
    }

    // Find user by email
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!existingUser || existingUser.length === 0) {
      return c.json({ error: "User not found. They must sign up first." }, 404);
    }

    const targetUser = existingUser[0];

    // Check if already admin
    const existingAdmin = await db
      .select()
      .from(admins)
      .where(eq(admins.userId, targetUser.id))
      .limit(1);

    if (existingAdmin && existingAdmin.length > 0) {
      return c.json({ error: "User is already an admin" }, 400);
    }

    // Add as admin
    const currentAdmin: any = (c as any).get("adminUser");
    const newAdmin = {
      id: generateId("admin"),
      userId: targetUser.id,
      email: targetUser.email,
      role,
      addedBy: currentAdmin.userId,
      createdAt: new Date(),
    };

    await db.insert(admins).values(newAdmin);

    return c.json({
      message: "Admin added successfully",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error adding admin:", error);
    return c.json({ error: "Failed to add admin" }, 500);
  }
});

// Delete admin (super admin only)
adminRoutes.delete("/admins/:id", async (c) => {
  const authError = await requireSuperAdmin(c);
  if (authError) return authError;

  try {
    const { id } = c.req.param();
    const currentAdmin: any = (c as any).get("adminUser");

    // Don't allow deleting yourself
    if (id === currentAdmin.id) {
      return c.json({ error: "Cannot delete your own admin account" }, 400);
    }

    await db.delete(admins).where(eq(admins.id, id));

    return c.json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return c.json({ error: "Failed to delete admin" }, 500);
  }
});

// ============= PROJECT MANAGEMENT =============

// List all projects
adminRoutes.get("/projects", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const projectsList = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));

    // Get origin counts for each project
    const projectsWithCounts = await Promise.all(
      projectsList.map(async (project) => {
        const origins = await db
          .select()
          .from(allowedOrigins)
          .where(eq(allowedOrigins.projectId, project.id));

        return {
          ...project,
          originCount: origins.length,
        };
      })
    );

    return c.json({ projects: projectsWithCounts });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Get single project
adminRoutes.get("/projects/:id", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const { id } = c.req.param();

    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!project || project.length === 0) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Get origins for this project
    const origins = await db
      .select()
      .from(allowedOrigins)
      .where(eq(allowedOrigins.projectId, id))
      .orderBy(desc(allowedOrigins.createdAt));

    return c.json({
      project: project[0],
      origins,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return c.json({ error: "Failed to fetch project" }, 500);
  }
});

// Create project
adminRoutes.post("/projects", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const body = await c.req.json();
    const { name, ownerEmail } = body;

    if (!name) {
      return c.json({ error: "Project name is required" }, 400);
    }

    const currentAdmin: any = (c as any).get("adminUser");
    const newProject = {
      id: generateId("proj"),
      name,
      ownerEmail: ownerEmail || null,
      status: "active",
      createdBy: currentAdmin.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(projects).values(newProject);

    return c.json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// Update project
adminRoutes.patch("/projects/:id", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { name, ownerEmail, status } = body;

    const updates: any = { updatedAt: new Date() };
    if (name) updates.name = name;
    if (ownerEmail !== undefined) updates.ownerEmail = ownerEmail;
    if (status) updates.status = status;

    await db.update(projects).set(updates).where(eq(projects.id, id));

    return c.json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

// Delete project
adminRoutes.delete("/projects/:id", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const { id } = c.req.param();

    await db.delete(projects).where(eq(projects.id, id));

    return c.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

// ============= ORIGIN MANAGEMENT =============

// Add origin to project
adminRoutes.post("/origins", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const body = await c.req.json();
    const { projectId, origin, environment = "production" } = body;

    if (!projectId || !origin) {
      return c.json({ error: "Project ID and origin are required" }, 400);
    }

    // Validate URL format
    try {
      new URL(origin);
    } catch {
      return c.json({ error: "Invalid origin URL format" }, 400);
    }

    // Check if origin already exists for this project
    const existing = await db
      .select()
      .from(allowedOrigins)
      .where(eq(allowedOrigins.projectId, projectId));

    const duplicate = existing.find((o) => o.origin === origin);

    if (duplicate) {
      return c.json({ error: "Origin already exists for this project" }, 400);
    }

    const newOrigin = {
      projectId,
      origin,
      environment,
      isActive: true,
      createdAt: new Date(),
    };

    const result = await db
      .insert(allowedOrigins)
      .values(newOrigin)
      .returning();

    return c.json({
      message: "Origin added successfully",
      origin: result[0],
    });
  } catch (error) {
    console.error("Error adding origin:", error);
    return c.json({ error: "Failed to add origin" }, 500);
  }
});

// Toggle origin active status
adminRoutes.patch("/origins/:id", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { isActive } = body;

    if (isActive === undefined) {
      return c.json({ error: "isActive field is required" }, 400);
    }

    await db
      .update(allowedOrigins)
      .set({ isActive })
      .where(eq(allowedOrigins.id, parseInt(id)));

    return c.json({ message: "Origin updated successfully" });
  } catch (error) {
    console.error("Error updating origin:", error);
    return c.json({ error: "Failed to update origin" }, 500);
  }
});

// Delete origin
adminRoutes.delete("/origins/:id", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const { id } = c.req.param();

    await db.delete(allowedOrigins).where(eq(allowedOrigins.id, parseInt(id)));

    return c.json({ message: "Origin deleted successfully" });
  } catch (error) {
    console.error("Error deleting origin:", error);
    return c.json({ error: "Failed to delete origin" }, 500);
  }
});

// ============= UTILITY =============

// Get dashboard stats
adminRoutes.get("/stats", async (c) => {
  const authError = await requireAdmin(c);
  if (authError) return authError;

  try {
    const totalProjects = await db.select().from(projects);
    const totalOrigins = await db.select().from(allowedOrigins);
    const activeProjects = totalProjects.filter((p) => p.status === "active");
    const activeOrigins = totalOrigins.filter((o) => o.isActive);

    return c.json({
      stats: {
        totalProjects: totalProjects.length,
        activeProjects: activeProjects.length,
        totalOrigins: totalOrigins.length,
        activeOrigins: activeOrigins.length,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

export default adminRoutes;
