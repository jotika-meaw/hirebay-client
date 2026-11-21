"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { uploadImage } from "@/lib/imgbb";

// Profile image field: direct URL input plus imgbb upload with preview.
export default function ImagePicker({ value, onChange, label = "Profile image" }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5 text-sm font-semibold">
      <label htmlFor="profile-image">{label}</label>
      <div className="flex gap-2">
        <input
          id="profile-image"
          type="url"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a direct image link"
          className="min-h-11 w-full min-w-0 flex-1 rounded-xl border border-input bg-card px-3.5 text-[15px] font-normal outline-0 placeholder:text-subtle focus-visible:border-foreground"
        />
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="sr-only" aria-label="Upload photo via imgbb" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-11 flex-none items-center gap-1.5 rounded-xl border border-input bg-card px-3 text-[13px] font-semibold transition-colors hover:bg-muted disabled:opacity-60"
        >
          <Upload className="size-4" aria-hidden="true" />
          {uploading ? "Uploading…" : "Upload · imgbb"}
        </button>
      </div>
      {value?.startsWith("http") && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Profile photo preview" className="mt-1 size-16 rounded-2xl border border-border object-cover" />
      )}
    </div>
  );
}
