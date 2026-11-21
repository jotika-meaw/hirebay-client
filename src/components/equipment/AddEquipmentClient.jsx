"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DataCard from "@/components/dashboard/DataCard";
import EquipmentForm from "@/components/equipment/EquipmentForm";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCreateEquipment, useMe } from "@/lib/data/hooks";

function initials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// /dashboard/owner/add: full owner form, status forced Pending, owner
// info from the account. ?name= prefills the equipment name.
export default function AddEquipmentClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const { data: me } = useMe();
  const createEquipment = useCreateEquipment();
  const owner = me?.data;

  function onSubmit(values) {
    createEquipment.mutate(values, {
      onSuccess: () => {
        toast.success("Equipment submitted for approval");
        router.push("/dashboard/owner/equipment");
      },
      onError: (err) => toast.error(err?.message || "Could not submit equipment"),
    });
  }

  return (
    <DataCard
      title="Add new equipment"
      action={null}
    >
      <p className="-mt-2 mb-4 text-sm text-muted-foreground">
        New listings are saved as <Badge variant="warning">Pending</Badge> until an admin approves them.
      </p>
      <EquipmentForm id="add-equipment-form" initial={{ name: sp.get("name") ?? "" }} onSubmit={onSubmit} />
      {owner && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border p-4">
          <Avatar className="size-10">
            <AvatarFallback className="bg-[#111111] text-xs font-extrabold text-white">
              {initials(owner.name)}
            </AvatarFallback>
          </Avatar>
          <p className="m-0 text-sm">
            <span className="block text-[11px] font-extrabold tracking-[0.06em] text-subtle">
              OWNER INFORMATION (FROM YOUR ACCOUNT)
            </span>
            <b>
              {owner.name} · {owner.email}
            </b>
          </p>
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2.5">
        <Link
          href="/dashboard/owner/equipment"
          className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Cancel
        </Link>
        <button
          type="submit"
          form="add-equipment-form"
          disabled={createEquipment.isPending}
          className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {createEquipment.isPending ? "Submitting…" : "Submit for approval"}
        </button>
      </div>
    </DataCard>
  );
}
