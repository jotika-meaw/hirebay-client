import { requireSession } from "@/lib/session";
import ProfileClient from "@/components/dashboard/ProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hirebay · My Profile",
  description: "View and edit your Hirebay profile.",
};

export default async function ProfilePage() {
  await requireSession();
  return <ProfileClient />;
}
