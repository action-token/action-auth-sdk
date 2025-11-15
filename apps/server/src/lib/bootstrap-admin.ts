import { db } from "../db";
import { admins, user } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function bootstrapSuperAdmin() {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

  if (!superAdminEmail) {
    console.log("No SUPER_ADMIN_EMAIL set, skipping bootstrap");
    return;
  }

  try {
    // Check if any admins exist
    const existingAdmins = await db.select().from(admins);

    if (existingAdmins.length > 0) {
      console.log("Admins already exist, skipping bootstrap");
      return;
    }

    // Find the user by email
    const targetUser = await db
      .select()
      .from(user)
      .where(eq(user.email, superAdminEmail))
      .limit(1);

    if (!targetUser || targetUser.length === 0) {
      console.log(
        `Super admin email ${superAdminEmail} not found in users. User must sign up first.`
      );
      return;
    }

    // Create the super admin
    const newAdmin = {
      id: `admin_${randomBytes(16).toString("hex")}`,
      userId: targetUser[0].id,
      email: targetUser[0].email,
      role: "super_admin",
      addedBy: null, // First admin has no creator
      createdAt: new Date(),
    };

    await db.insert(admins).values(newAdmin);

    console.log(`✅ Super admin created for ${superAdminEmail}`);
  } catch (error) {
    console.error("Error bootstrapping super admin:", error);
  }
}
