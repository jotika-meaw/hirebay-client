"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({ open, onOpenChange, title, body, confirmLabel = "Delete", onConfirm, pending }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-label={title}>
        <DialogTitle className="font-display text-[22px] font-extrabold tracking-tight">{title}</DialogTitle>
        {body ? <DialogDescription className="text-sm text-muted-foreground">{body}</DialogDescription> : null}
        <div className="mt-2 flex justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={pending}>
            {pending ? "Working…" : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
