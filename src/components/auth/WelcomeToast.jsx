"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Toasts once after a Google sign-in lands on ?welcome=google, then cleans
// the param so reloads stay quiet. Rendered in the dashboard shell so it
// fires wherever the post-login redirect lands.
export default function WelcomeToast() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (sp.get("welcome") !== "google" || done.current) return;
    done.current = true;
    toast.success("Welcome! You're logged in with Google.");
    const next = new URLSearchParams(sp.toString());
    next.delete("welcome");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [sp, pathname, router]);

  return null;
}
