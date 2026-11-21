import { requireRole } from "@/lib/session";
import CustomerRentals from "@/components/dashboard/CustomerRentals";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · My Rentals",
  description: "Track your equipment rentals, payments and booking status.",
};

export default async function RentalsPage() {
  await requireRole(["customer"]);
  return <CustomerRentals />;
}
