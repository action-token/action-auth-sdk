import { AdminGuard } from "@/components/admin/admin-guard";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      {children}
      <Toaster />
    </AdminGuard>
  );
}
