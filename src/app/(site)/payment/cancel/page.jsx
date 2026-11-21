import { Suspense } from "react";
import PaymentCancel from "@/components/payment/PaymentCancel";

export const metadata = {
  title: "Hirebay · Payment Cancelled",
  description: "Your payment was not completed — retry or change your dates.",
};

export default function PaymentCancelPage() {
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
          <PaymentCancel />
        </Suspense>
      </div>
    </main>
  );
}
