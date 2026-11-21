// Client-side imgbb upload for owner/user photos.
// NEXT_PUBLIC_IMGBB_KEY is a public upload key (safe to expose).
const MAX_BYTES = 5 * 1024 * 1024;

// Rejects non-images and files over 5 MB before anything is uploaded.
// All upload buttons route through uploadImage(), so every entry point
// toasts these errors instead of sending a doomed request.
export function validateImage(file) {
  if (!file || typeof file.type !== "string" || !file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (PNG, JPG, GIF or WebP)");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be under 5 MB");
  }
  return true;
}

export async function uploadImage(file) {
  validateImage(file);
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload is not configured");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, {
    method: "POST",
    body: form,
  });
  const json = await res.json().catch(() => null);
  const url = json?.data?.url;
  if (!res.ok || !url) throw new Error("Image upload failed");
  return url;
}
