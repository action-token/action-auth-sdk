import { sql } from "drizzle-orm";
import { index, integer, text } from "drizzle-orm/sqlite-core";
import { createTable } from "./posts-schema";
import { user } from "./auth-schema";

// Admins table - links users to admin privileges
export const admins = createTable(
  "admin",
  (d) => ({
    id: d.text().primaryKey(),
    userId: d
      .text()
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    email: d.text().notNull(), // Denormalized for quick lookup
    role: d.text().notNull().default("admin"), // "admin" or "super_admin"
    addedBy: d.text(), // userId of admin who added them
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [
    index("admin_user_idx").on(t.userId),
    index("admin_email_idx").on(t.email),
  ]
);

// Projects table - registered projects using the auth
export const projects = createTable(
  "project",
  (d) => ({
    id: d.text().primaryKey(),
    name: d.text().notNull(),
    ownerEmail: d.text(), // Contact email for project owner
    status: d.text().notNull().default("active"), // "active" or "suspended"
    createdBy: d.text(), // Admin userId who created it
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  }),
  (t) => [index("project_status_idx").on(t.status)]
);

// Allowed origins table - domains allowed for each project
export const allowedOrigins = createTable(
  "allowed_origin",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    projectId: d
      .text()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    origin: d.text().notNull(), // The URL (https://example.com)
    environment: d.text().default("production"), // "production", "staging", "development"
    isActive: d.integer({ mode: "boolean" }).notNull().default(true),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    lastUsedAt: d.integer({ mode: "timestamp" }), // Track when last used
  }),
  (t) => [
    index("origin_project_idx").on(t.projectId),
    index("origin_active_idx").on(t.isActive),
  ]
);
