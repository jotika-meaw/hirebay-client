import { requireRole } from "@/lib/session";
import OwnerRentalsTable from "@/components/equipment/OwnerRentalsTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · My Equipment Rentals",
  description: "Rentals of your equipment.",
};

export default async function OwnerRentalsPage() {
  await requireRole(["owner"]);
  return <OwnerRentalsTable />;
}
