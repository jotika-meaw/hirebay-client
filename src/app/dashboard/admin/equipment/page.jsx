import { requireRole } from "@/lib/session";
import AdminEquipmentTable from "@/components/dashboard/AdminEquipmentTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · All Equipment (Admin)",
  description: "Moderate every equipment listing.",
};

export default async function AdminEquipmentPage() {
  await requireRole(["admin"]);
  return <AdminEquipmentTable />;
}
