"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/admin-api";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    async function checkAdmin() {
      // Wait for session to finish loading
      if (session.isPending) {
        return;
      }

      // If no session after loading, redirect
      if (!session.data) {
        router.push("/");
        return;
      }

      // Session exists, now check admin status with Bearer token
      try {
        const response = await authenticatedFetch("/api/admin/check");

        if (response.ok) {
          setIsAdmin(true);
        } else {
          console.error("Admin check failed:", response.status);
          router.push("/");
        }
      } catch (error) {
        console.error("Admin check failed:", error);
        router.push("/");
      }
    }

    checkAdmin();
  }, [session.data, session.isPending, router]);

  // Show loading while session is pending OR admin check is in progress
  if (session.isPending || isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">
          {session.isPending
            ? "Loading session..."
            : "Verifying admin access..."}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
