import { Suspense } from "react";
import CatalogContent from "@/components/catalog/CatalogContent";

export const metadata = {
  title: "Hirebay · All Equipment",
  description: "Browse approved equipment across Bangladesh — search by name and location, filter and sort.",
};

export default function EquipmentPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <Suspense
        fallback={
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-5 px-7 pt-14 pb-[90px] sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading equipment">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[380px] animate-pulse rounded-[24px] bg-muted" />
            ))}
          </div>
        }
      >
        <CatalogContent />
      </Suspense>
    </main>
  );
}
