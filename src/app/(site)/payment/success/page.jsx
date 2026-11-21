import { Suspense } from "react";
import PaymentSuccess from "@/components/payment/PaymentSuccess";

export const metadata = {
  title: "Hirebay · Payment Successful",
  description: "Your booking is confirmed and the transaction is saved to your rentals.",
};

export default function PaymentSuccessPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-7 py-[70px]">
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-[620px] animate-pulse rounded-[32px] border border-border bg-card px-6 py-10 text-center sm:px-10" aria-label="Loading payment result">
              <div className="mx-auto size-[76px] rounded-full bg-muted" />
              <div className="mx-auto mt-4 h-8 w-2/3 rounded-xl bg-muted" />
            </div>
          }
        >
          <PaymentSuccess />
        </Suspense>
      </div>
    </main>
  );
}
