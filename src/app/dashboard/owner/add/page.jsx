import { Suspense } from "react";
import { requireRole } from "@/lib/session";
import AddEquipmentClient from "@/components/equipment/AddEquipmentClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · Add Equipment",
  description: "List your equipment on Hirebay.",
};

export default async function AddEquipmentPage() {
  await requireRole(["owner"]);
  return (
    <Suspense fallback={<div className="h-[420px] animate-pulse rounded-[22px] bg-muted" aria-label="Loading add equipment form" />}>
      <AddEquipmentClient />
    </Suspense>
  );
}
