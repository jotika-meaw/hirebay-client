import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

// Stub until BetterAuth lands in F-06. The navbar and guards read the
// session only through this hook, so swapping in authClient.useSession()
// later touches one file.
export const STUB_USER = null;

const subscribe = () => () => {};

export function useSession() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  if (!mounted) return { data: null, isLoggedIn: false };
  return { data: STUB_USER, isLoggedIn: Boolean(STUB_USER) };
}
