"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/imgbb";
import ImagePicker from "@/components/dashboard/ImagePicker";
import { equipmentSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

const CONDITIONS = ["Like new", "Excellent", "Good", "Fair"];

const inputCls =
  "min-h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground aria-[invalid=true]:border-danger";

function FieldError({ message }) {
  if (!message) return null;
  return <p role="alert" className="m-0 text-[13px] font-semibold text-danger">{String(message)}</p>;
}

// Full owner equipment form (01 owner list). Used by Add equipment and,
// with values filled, by the edit dialog. Submit buttons live outside the
// form and target it via the `id` prop. Status stays Pending and is never
// editable here.
export default function EquipmentForm({ id = "equipment-form", initial, onSubmit, compact = false }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      category: initial?.category ?? CATEGORIES[0],
      location: initial?.location ?? "",
      price: initial?.price ?? "",
      rentalType: initial?.rentalType ?? "daily",
      quantity: initial?.quantity ?? 1,
      condition: initial?.condition ?? "Good",
      brand: initial?.brand ?? "",
      model: initial?.model ?? "",
      image: initial?.image ?? "",
      terms: Array.isArray(initial?.terms) ? initial.terms.join("\n") : (initial?.terms ?? ""),
    },
  });
  const imageValue = useWatch({ control, name: "image" }) ?? "";

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("image", url, { shouldValidate: true });
      toast.success("Uploaded to imgbb");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function onInvalid() {
    toast.error("Check the highlighted fields and try again");
  }

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit, onInvalid)} className={cn(compact ? "flex flex-col gap-4" : "grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]")} noValidate>
      <div
        className={cn(
          "flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-muted/40 p-4 text-center",
          compact && "min-h-[160px]"
        )}
      >
        {imageValue ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageValue} alt="Equipment photo preview" className="max-h-44 w-full rounded-xl border border-border object-cover" />
        ) : (
          <>
            <ImagePlus className="size-8 text-subtle" aria-hidden="true" />
            <p className="m-0 text-sm font-semibold">Drop a photo here</p>
            <p className="m-0 text-xs text-muted-foreground">or paste an image link below</p>
          </>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="sr-only" aria-label="Upload equipment photo via imgbb" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-input bg-card px-3.5 text-[13px] font-semibold transition-colors hover:bg-muted disabled:opacity-60"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {uploading ? "Uploading…" : imageValue ? "Replace" : "Upload · imgbb"}
        </button>
        {imageValue && !uploading && (
          <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success">✓ Uploaded to imgbb</span>
        )}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2">
          Equipment name
          <input {...register("name")} placeholder="Hydraulic Excavator 20T — CAT 320" aria-invalid={Boolean(errors.name)} className={inputCls} />
          <FieldError message={errors.name?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2">
          Category
          <select {...register("category")} aria-invalid={Boolean(errors.category)} className={cn(inputCls, "cursor-pointer appearance-none")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <FieldError message={errors.category?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Location
          <input {...register("location")} placeholder="Tongi, Gazipur" aria-invalid={Boolean(errors.location)} className={inputCls} />
          <FieldError message={errors.location?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Rental price (৳)
          <input {...register("price")} type="number" min={1} placeholder="18500" aria-invalid={Boolean(errors.price)} className={inputCls} />
          <FieldError message={errors.price?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Rental type
          <select {...register("rentalType")} aria-invalid={Boolean(errors.rentalType)} className={cn(inputCls, "cursor-pointer appearance-none")}>
            {RENTAL_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <FieldError message={errors.rentalType?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Available quantity
          <input {...register("quantity")} type="number" min={0} max={999} aria-invalid={Boolean(errors.quantity)} className={inputCls} />
          <FieldError message={errors.quantity?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Condition
          <select {...register("condition")} aria-invalid={Boolean(errors.condition)} className={cn(inputCls, "cursor-pointer appearance-none")}>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <FieldError message={errors.condition?.message} />
        </label>
        <div className="flex flex-col gap-1.5 text-sm font-semibold">
          <span id="owner-status-label">Status</span>
          <span aria-labelledby="owner-status-label" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-input bg-muted px-3.5 text-[15px]">
            <span className="rounded-full bg-warning-bg px-2.5 py-0.5 text-xs font-bold text-warning">Pending</span>
            <span className="text-xs font-normal text-muted-foreground">set automatically</span>
          </span>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Brand
          <input {...register("brand")} placeholder="Caterpillar" aria-invalid={Boolean(errors.brand)} className={inputCls} />
          <FieldError message={errors.brand?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Model
          <input {...register("model")} placeholder="320 GC" aria-invalid={Boolean(errors.model)} className={inputCls} />
          <FieldError message={errors.model?.message} />
        </label>
        <div className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2">
          <ImagePicker value={imageValue} onChange={(v) => setValue("image", v, { shouldValidate: true })} label="Image link" />
          {errors.image && <p role="alert" className="m-0 text-[13px] font-semibold text-danger">{errors.image.message}</p>}
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2">
          Description
          <textarea {...register("description")} rows={compact ? 3 : 4} placeholder="Capacity, condition, what's included…" aria-invalid={Boolean(errors.description)} className="resize-y rounded-xl border border-input bg-card px-3.5 py-2.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground aria-[invalid=true]:border-danger" />
          <FieldError message={errors.description?.message} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold sm:col-span-2">
          Rental terms &amp; conditions
          <textarea {...register("terms")} rows={compact ? 3 : 4} placeholder="One rule per line — minimum rental, fuel, cancellation…" aria-invalid={Boolean(errors.terms)} className="resize-y rounded-xl border border-input bg-card px-3.5 py-2.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground aria-[invalid=true]:border-danger" />
          <FieldError message={errors.terms?.message} />
        </label>
      </div>
    </form>
  );
}
