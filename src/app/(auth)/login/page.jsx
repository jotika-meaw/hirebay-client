import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Hirebay · Login",
  description: "Log in to Hirebay to browse, favorite and book equipment.",
};

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  return <LoginForm redirect={sp?.redirect} />;
}
