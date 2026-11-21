import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Hirebay · Register",
  description: "Create a Hirebay account to rent gear or list your own.",
};

export default async function RegisterPage({ searchParams }) {
  const sp = await searchParams;
  return <RegisterForm redirect={sp?.redirect} initialRole={sp?.role} />;
}
