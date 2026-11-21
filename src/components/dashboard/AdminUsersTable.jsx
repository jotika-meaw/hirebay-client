"use client";

import { useState } from "react";
import { toast } from "sonner";
import ChangeRoleDialog from "@/components/dashboard/ChangeRoleDialog";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import DataCard from "@/components/dashboard/DataCard";
import Pager from "@/components/dashboard/Pager";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminUsers, useDeleteUser, useMe, useUpdateRole } from "@/lib/data/hooks";
import { formatDate } from "@/lib/money";
import { cn } from "@/lib/utils";

const LIMIT = 10;
const ROLES = ["customer", "owner", "admin"];

function initials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Admin users: search, role filter, role select → confirm, remove.
// The admin's own row cannot be changed or removed.
export default function AdminUsersTable() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [roleTarget, setRoleTarget] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [drafts, setDrafts] = useState({});
  const { data, isPending } = useAdminUsers({ search: search.trim() || undefined, role: role || undefined, page, limit: LIMIT });
  const { data: meData } = useMe();
  const updateRole = useUpdateRole();
  const deleteUser = useDeleteUser();
  const myId = meData?.data?.id ?? null;
  const items = data?.items ?? [];

  function applySearch(value) {
    setSearch(value);
    setPage(1);
  }

  function confirmRoleChange() {
    if (!roleTarget) return;
    updateRole.mutate(
      { id: roleTarget.user.id, role: roleTarget.next },
      {
        onSuccess: () => {
          toast.success(`Role updated to ${roleTarget.next}`);
          setDrafts((d) => ({ ...d, [roleTarget.user.id]: undefined }));
          setRoleTarget(null);
        },
        onError: (err) => toast.error(err?.message || "Could not update role"),
      }
    );
  }

  function openRoleChange(user) {
    const next = drafts[user.id] ?? user.role;
    if (next === user.role) {
      toast.error("Pick a different role in the dropdown first");
      return;
    }
    setRoleTarget({ user, next });
  }

  function confirmRemove() {
    if (!removeTarget) return;
    deleteUser.mutate(removeTarget.id, {
      onSuccess: () => {
        toast.success("User removed");
        setRemoveTarget(null);
      },
      onError: (err) => toast.error(err?.message || "Could not remove user"),
    });
  }

  return (
    <>
      <DataCard
        title={`All users · ${(data?.total ?? 0).toLocaleString("en-IN")}`}
        action={
          <span className="flex flex-wrap gap-2">
            <input
              type="search"
              value={search}
              onChange={(e) => applySearch(e.target.value)}
              placeholder="Search name or email…"
              aria-label="Search by name or email"
              className="min-h-11 w-55 rounded-xl border border-input bg-card px-3.5 text-sm outline-0 placeholder:text-subtle focus-visible:border-foreground"
            />
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by role"
              className="min-h-11 cursor-pointer appearance-none rounded-xl border border-input bg-card px-3.5 pr-8 text-sm font-semibold outline-0 focus-visible:border-foreground"
            >
              <option value="">All roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r[0].toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </span>
        }
      >
        {isPending ? (
          <div className="flex flex-col gap-3" aria-label="Loading users">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[62px] animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="m-0 rounded-xl bg-muted px-4 py-10 text-center text-sm text-muted-foreground">
            No users match your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-[11px] font-extrabold tracking-[0.06em] text-subtle uppercase">
                  <th className="px-2 py-3">Name</th>
                  <th className="px-2 py-3">Email</th>
                  <th className="px-2 py-3">Role</th>
                  <th className="px-2 py-3">Registered</th>
                  <th className="px-2 py-3 text-right">Manage</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => {
                  const isSelf = myId !== null && u.id === myId;
                  return (
                    <tr key={u.id} className="border-t border-border align-middle transition-colors hover:bg-muted/60">
                      <td className="px-2 py-3">
                        <span className="flex items-center gap-2.5">
                          <Avatar className={cn("size-9", isSelf && "ring-2 ring-brand")}>
                            <AvatarFallback className="bg-[#C2410C] text-xs font-extrabold text-white">
                              {initials(u.name)}
                            </AvatarFallback>
                          </Avatar>
                          <b>
                            {u.name}
                            {isSelf && <span className="ml-2 text-xs font-semibold text-muted-foreground">(you)</span>}
                          </b>
                        </span>
                      </td>
                      <td className="px-2 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-2 py-3">
                        <select
                          value={drafts[u.id] ?? u.role}
                          disabled={isSelf}
                          title={isSelf ? "You cannot change your own role" : `Change role for ${u.name}`}
                          aria-label={isSelf ? `${u.name} (your account, role locked)` : `New role for ${u.name}`}
                          onChange={(e) => setDrafts((d) => ({ ...d, [u.id]: e.target.value }))}
                          className="min-h-9 cursor-pointer rounded-xl border border-input bg-card px-2.5 text-sm font-semibold outline-0 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r[0].toUpperCase() + r.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-3 font-mono text-[13px]">{u.createdAt ? formatDate(u.createdAt) : "—"}</td>
                      <td className="px-2 py-3">
                        <span className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={isSelf}
                            title={isSelf ? "You cannot change your own role" : undefined}
                            onClick={() => openRoleChange(u)}
                            className="inline-flex min-h-9 items-center rounded-full border border-input bg-card px-3.5 text-[13px] font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Change role
                          </button>
                          <button
                            type="button"
                            disabled={isSelf}
                            title={isSelf ? "You cannot remove yourself" : undefined}
                            onClick={() => setRemoveTarget(u)}
                            className="inline-flex min-h-9 items-center rounded-full border border-input bg-card px-3.5 text-[13px] font-semibold text-danger transition-colors hover:bg-danger-bg disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!isPending && <Pager page={data?.page ?? 1} pages={data?.pages ?? 1} total={data?.total ?? 0} limit={LIMIT} onPage={setPage} />}
      </DataCard>
      <ChangeRoleDialog
        user={roleTarget?.user ?? null}
        nextRole={roleTarget?.next ?? "customer"}
        open={Boolean(roleTarget)}
        onOpenChange={(v) => { if (!v) setRoleTarget(null); }}
        onConfirm={confirmRoleChange}
        pending={updateRole.isPending}
      />
      <ConfirmDialog
        open={Boolean(removeTarget)}
        onOpenChange={(v) => { if (!v) setRemoveTarget(null); }}
        title={`Remove ${removeTarget?.name ?? "user"}?`}
        body="Their sessions and favourites go with the account. This cannot be undone."
        confirmLabel="Remove"
        pending={deleteUser.isPending}
        onConfirm={confirmRemove}
      />
    </>
  );
}
