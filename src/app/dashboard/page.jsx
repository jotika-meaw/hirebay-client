import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import AdminOverview from "@/components/dashboard/AdminOverview";
import OwnerOverview from "@/components/dashboard/OwnerOverview";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · Dashboard",
  description: "Your Hirebay dashboard.",
};

// /dashboard: customers go to their rentals; owners/admins see their
// overview here. Role pages below guard themselves with requireRole.
export default async function DashboardPage() {
  const session = await requireSession();
  const role = session.user.role ?? "customer";
  if (role === "customer") redirect("/dashboard/rentals");
  if (role === "admin") return <AdminOverview />;
  return <OwnerOverview />;
}
