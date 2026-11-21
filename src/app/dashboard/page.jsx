import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · Dashboard",
};

// Temporary guard test page — F-20 replaces it with the real shell.
// Proves the proxy cookie check + requireSession survive a reload.
export default async function DashboardPage() {
  const session = await requireSession();
  const { user } = session;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-6 text-center">
      <p className="font-mono text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase">
        Signed in
      </p>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        {user.name} ({user.role ?? "customer"})
      </h1>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </main>
  );
}
