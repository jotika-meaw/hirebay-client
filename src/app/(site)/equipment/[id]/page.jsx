import { Suspense } from "react";
import EquipmentDetails from "@/components/equipment/EquipmentDetails";

export const metadata = {
  title: "Hirebay · Equipment Details",
  description: "View equipment details, availability and owner information.",
};

export default function EquipmentDetailsPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-[1240px] px-7 pt-10 pb-[90px]" aria-label="Loading equipment details">
            <div className="h-[380px] animate-pulse rounded-[24px] bg-muted" />
          </div>
        }
      >
        <EquipmentDetails />
      </Suspense>
    </main>
  );
}
