import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

// Server-only session guards for dashboard layouts and role pages.
export async function requireSession() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login?redirect=/dashboard");
  return session;
}

export async function requireRole(roles) {
  const session = await requireSession();
  const role = session.user.role ?? "customer";
  if (!roles.includes(role)) redirect("/dashboard");
  return session;
}
