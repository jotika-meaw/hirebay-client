// Client-side imgbb upload for owner/user photos.
// NEXT_PUBLIC_IMGBB_KEY is a public upload key (safe to expose).
export async function uploadImage(file) {
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
