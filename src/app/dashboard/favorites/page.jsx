import { requireRole } from "@/lib/session";
import FavoritesTable from "@/components/dashboard/FavoritesTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · Favorites",
  description: "Your saved equipment.",
};

export default async function FavoritesPage() {
  await requireRole(["customer"]);
  return <FavoritesTable />;
}
