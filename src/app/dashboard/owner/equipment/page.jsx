import { requireRole } from "@/lib/session";
import MyEquipmentTable from "@/components/equipment/MyEquipmentTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · My Equipment",
  description: "Manage your equipment listings.",
};

export default async function MyEquipmentPage() {
  await requireRole(["owner"]);
  return <MyEquipmentTable />;
}
