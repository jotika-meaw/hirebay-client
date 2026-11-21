import { requireSession } from "@/lib/session";
import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export const dynamic = "force-dynamic";

// Dashboard shell: server guard + own shell (no site navbar/footer).
// Gutter 16px, sidebar 256px; mobile strip at ≤ 860px.
export default async function DashboardLayout({ children }) {
  const session = await requireSession();
  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    role: session.user.role ?? "customer",
  };
  const hour = new Date().getHours();
  const greeting = `Good ${hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening"}, ${String(user.name).split(" ")[0]}`;
  const heading = user.role === "owner" ? greeting : user.role === "admin" ? "Platform overview" : undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 p-4">
        <Sidebar user={user} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <MobileNav user={user} />
          <Topbar user={user} heading={heading} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
