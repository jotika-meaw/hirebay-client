"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};

export default function ThemeToggle({ className }) {
  // Mounted check via useSyncExternalStore (Next 16 lint forbids the
  // useEffect + setState mounted flag).
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        disabled
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-full border border-input bg-card text-muted-foreground",
          className
        )}
      >
        <Sun className="size-5" aria-hidden="true" />
      </button>
    );
  }

  const dark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-input bg-card text-foreground transition-colors hover:bg-muted",
        className
      )}
    >
      {dark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
