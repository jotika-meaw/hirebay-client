import { requireRole } from "@/lib/session";
import AdminUsersTable from "@/components/dashboard/AdminUsersTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · All Users",
  description: "Manage users and their roles.",
};

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  return <AdminUsersTable />;
}
