"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import StatusBadge from "@/components/dashboard/StatusBadge";

const ROLE_COPY = {
  customer: "Customers can browse, favorite, book and pay for equipment.",
  owner: "Owners can list equipment and see rentals of their listings. The change applies immediately on their next request.",
  admin: "Admins can manage users, moderate all equipment and see all rentals.",
};

// Confirm dialog (PNG 16b): "Change role for {name}?" with old → new badges.
export default function ChangeRoleDialog({ user, nextRole, open, onOpenChange, onConfirm, pending }) {
  if (!user) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-label={`Change role for ${user.name}`}>
        <DialogTitle className="font-display text-[22px] font-extrabold tracking-tight">
          Change role for {user.name}?
        </DialogTitle>
        <p className="m-0 flex items-center gap-2 text-sm">
          <StatusBadge status={user.role}>{user.role}</StatusBadge>
          <span aria-hidden="true">→</span>
          <StatusBadge status={nextRole}>{nextRole}</StatusBadge>
        </p>
        <p className="m-0 text-sm leading-6 text-muted-foreground">{ROLE_COPY[nextRole]}</p>
        <div className="mt-2 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Confirm change"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
