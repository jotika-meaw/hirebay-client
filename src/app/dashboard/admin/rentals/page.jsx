import { requireRole } from "@/lib/session";
import AdminRentalsTable from "@/components/dashboard/AdminRentalsTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · All Rentals",
  description: "Manage every booking on the platform.",
};

export default async function AdminRentalsPage() {
  await requireRole(["admin"]);
  return <AdminRentalsTable />;
}
