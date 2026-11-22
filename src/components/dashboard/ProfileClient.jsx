"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import ImagePicker from "@/components/dashboard/ImagePicker";
import UserAvatar from "@/components/layout/UserAvatar";
import { authClient } from "@/lib/auth-client";
import { useMe, useUpdateMe } from "@/lib/data/hooks";
import { phoneSchema } from "@/lib/validators";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function memberSince(iso) {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const profileSchema = z.object({
  name: z.string().min(2, "Name needs at least 2 characters").max(80),
  image: z.string().refine((v) => v === "" || /^https?:\/\/.+/.test(v), {
    message: "Paste a valid image link or upload one",
  }),
  phone: phoneSchema,
  address: z.string().max(200, "Address must be under 200 characters"),
});

const ROLE_BADGE = { customer: "success", owner: "info", admin: "brand" };

// Profile for every role: identity card + editable form (email read-only).
export default function ProfileClient() {
  const router = useRouter();
  const { data, isPending } = useMe();
  const { refetch: refetchSession } = authClient.useSession();
  const updateMe = useUpdateMe();
  const user = data?.data;

  const defaults = useMemo(
    () => ({
      name: user?.name ?? "",
      image: user?.image ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    }),
    [user]
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: defaults,
  });
  const imageValue = useWatch({ control, name: "image" }) ?? "";

  if (isPending || !user) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" aria-label="Loading profile">
        <div className="h-[380px] animate-pulse rounded-[28px] bg-muted" />
        <div className="h-[380px] animate-pulse rounded-[28px] bg-muted" />
      </div>
    );
  }

  function onSubmit(values) {
    updateMe.mutate(values, {
      onSuccess: async () => {
        toast.success("Profile updated");
        // Push the new photo into the BetterAuth client store (navbars read
        // it from useSession) and re-render server components (the dashboard
        // layout reads the user from the session server-side).
        try {
          await refetchSession();
        } catch {
          // Session refreshes on the next navigation.
        }
        router.refresh();
      },
      onError: (err) => toast.error(err?.message || "Could not save profile"),
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="overflow-hidden rounded-[28px] border border-border bg-card">
        <div aria-hidden="true" className="h-28 bg-brand [background-image:radial-gradient(rgba(17,17,17,0.18)_1.2px,transparent_1.2px)] [background-size:14px_14px]" />
        <div className="-mt-10 flex flex-col items-center px-6 pb-6 text-center">
          <UserAvatar
            user={user}
            className="size-20 ring-4 ring-card"
            fallbackClassName="bg-[#C2410C] font-display text-2xl font-extrabold text-white"
          />
          <b className="mt-3 font-display text-2xl font-extrabold tracking-tight">{user.name}</b>
          <Badge variant={ROLE_BADGE[user.role] ?? "neutral"} className="mt-1.5 capitalize">
            {user.role}
          </Badge>
          <dl className="m-0 mt-4 w-full text-sm">
            {[
              ["Email", user.email],
              ["Phone", user.phone || "—"],
              ["Address", user.address || "—"],
              ["Member since", user.createdAt ? memberSince(user.createdAt) : "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 border-t border-border py-2.5 text-left">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="m-0 truncate font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit, () => toast.error("Check the highlighted fields and try again"))}
        className="rounded-[28px] border border-border bg-card p-6"
        noValidate
      >
        <h2 className="m-0 font-display text-xl font-extrabold tracking-tight">Edit profile</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Name
            <input
              {...register("name")}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              className="min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 focus-visible:border-foreground aria-[invalid=true]:border-danger"
            />
            {errors.name && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.name.message}</p>}
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Email
            <input
              value={user.email}
              readOnly
              aria-readonly="true"
              className="min-h-11 rounded-xl border border-input bg-muted px-3.5 text-[15px] font-normal text-muted-foreground outline-0"
            />
          </label>
        </div>
        <div className="mt-4">
          <ImagePicker value={imageValue} onChange={(v) => setValue("image", v, { shouldValidate: true })} />
          {errors.image && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.image.message}</p>}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Phone number
            <input
              {...register("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="+880 1XXX-XXXXXX"
              aria-invalid={Boolean(errors.phone)}
              className="min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground aria-[invalid=true]:border-danger"
            />
            {errors.phone && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.phone.message}</p>}
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Address
            <input
              {...register("address")}
              autoComplete="street-address"
              aria-invalid={Boolean(errors.address)}
              className="min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground aria-[invalid=true]:border-danger"
            />
            {errors.address && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.address.message}</p>}
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => reset(defaults)}
            className="inline-flex min-h-11 items-center rounded-full border border-input bg-card px-6 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMe.isPending}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
          >
            {updateMe.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
