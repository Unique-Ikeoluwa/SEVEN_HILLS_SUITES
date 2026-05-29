import { AdminGuard } from "@/components/auth/AdminGuard";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function page() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}

