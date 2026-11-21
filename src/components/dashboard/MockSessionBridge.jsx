"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { source } from "@/lib/data/source";

// Bridges the BetterAuth session to the mock data layer (Phase F only).
// The mock store has its own demo users, so the signed-in role is mapped
// to its demo persona: customer → u-rafi, owner → u-karim, admin → u-admin.
// Logged out (or the real API) → no mock session. Queries are invalidated
// on every session change so roles never leak across accounts.
const PERSONA = { customer: "u-rafi", owner: "u-karim", admin: "u-admin" };

export default function MockSessionBridge() {
  const { data: session, isPending } = authClient.useSession();
  const client = useQueryClient();
  const role = session?.user?.role ?? null;
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DATA_SOURCE === "api") return;
    if (isPending) return;
    if (typeof source.setMockSession !== "function") return;
    source.setMockSession(role ? (PERSONA[role] ?? "u-rafi") : null);
    client.invalidateQueries();
  }, [client, role, userId, isPending]);

  return null;
}
