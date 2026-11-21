"use client";

import Image from "next/image";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import { useUpdateEquipment } from "@/lib/data/hooks";

// Edit dialog (PNG 14b): the same form with values filled. Saving sends
// the listing back to Pending for re-approval (server rule).
export default function EquipmentEditDialog({ item, open, onOpenChange }) {
  const updateEquipment = useUpdateEquipment();

  function onSubmit(values) {
    updateEquipment.mutate(
      { id: item.id, ...values, terms: values.terms },
      {
        onSuccess: () => {
          toast.success("Changes saved — back to Pending for re-approval");
          onOpenChange(false);
        },
        onError: (err) => toast.error(err?.message || "Could not save changes"),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[880px] overflow-y-auto sm:max-w-[880px]" aria-label={`Update ${item?.name ?? "equipment"}`}>
        <DialogTitle className="font-display text-xl font-extrabold tracking-tight">Update equipment</DialogTitle>
        {item && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span className="relative block size-[72px] flex-none overflow-hidden rounded-2xl border border-border">
                <Image src={item.image} alt="" fill sizes="72px" className="object-cover" />
              </span>
              <p className="m-0 text-sm text-muted-foreground">
                Saving changes sends the listing back to{" "}
                <span className="rounded-full bg-warning-bg px-2 py-0.5 text-xs font-bold text-warning">Pending</span>{" "}
                for re-approval.
              </p>
            </div>
            <EquipmentForm
              key={item.id}
              id={`edit-equipment-${item.id}`}
              compact
              initial={{
                ...item,
                price: item.price,
                quantity: item.quantity,
                image: item.image ?? "",
                terms: Array.isArray(item.terms) ? item.terms.join("\n") : (item.terms ?? ""),
              }}
              onSubmit={onSubmit}
            />
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={`edit-equipment-${item.id}`}
                disabled={updateEquipment.isPending}
                className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {updateEquipment.isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
