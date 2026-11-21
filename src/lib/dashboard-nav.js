"use client";

import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Heart,
  LayoutGrid,
  Package,
  Plus,
  ReceiptText,
  User,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

export const DASHBOARD_MENUS = {
  customer: [
    { href: "/dashboard/rentals", label: "My rentals", Icon: CalendarDays },
    { href: "/dashboard/favorites", label: "Favorites", Icon: Heart },
    { href: "/dashboard/profile", label: "Profile", Icon: User },
  ],
  owner: [
    { href: "/dashboard", label: "Overview", Icon: LayoutGrid },
    { href: "/dashboard/owner/add", label: "Add equipment", Icon: Plus },
    { href: "/dashboard/owner/equipment", label: "My equipment", Icon: Package },
    { href: "/dashboard/owner/rentals", label: "Equipment rentals", Icon: ReceiptText },
    { href: "/dashboard/profile", label: "My profile", Icon: User },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", Icon: LayoutGrid },
    { href: "/dashboard/admin/users", label: "All users", Icon: Users },
    { href: "/dashboard/admin/equipment", label: "All equipment", Icon: Package },
    { href: "/dashboard/admin/rentals", label: "All rentals", Icon: ReceiptText },
    { href: "/dashboard/profile", label: "My profile", Icon: User },
  ],
};

export function menuFor(role) {
  return DASHBOARD_MENUS[role] ?? DASHBOARD_MENUS.customer;
}

export function initials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function useLogout() {
  const router = useRouter();
  return async function logout() {
    await authClient.signOut();
    clearToken();
    router.push("/");
    router.refresh();
  };
}
