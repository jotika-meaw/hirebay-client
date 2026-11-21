"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/redirect";
import AuthTabs from "@/components/auth/AuthTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

export default function LoginForm({ redirect }) {
  const router = useRouter();
  const target = safeRedirect(redirect);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) router.replace(target);
  }, [isPending, session, router, target]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (!isPending && session?.user) return null;

  async function onSubmit(values) {
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast.error(error.message || "Login failed");
      return;
    }
    toast.success(`Welcome back, ${data?.user?.name?.split(" ")[0] ?? "Renter"}!`, {
      description: "You're logged in.",
    });
    router.push(target);
    router.refresh();
  }

  function continueWithGoogle() {
    // No Google keys are configured (owner decision): stay put with a toast
    // instead of navigating into a provider error. Flip
    // NEXT_PUBLIC_GOOGLE_ENABLED=1 when keys are added.
    if (process.env.NEXT_PUBLIC_GOOGLE_ENABLED !== "1") {
      toast.error("Google sign-in isn't set up yet — use email instead");
      return;
    }
    authClient.signIn.social({ provider: "google", callbackURL: target });
  }

  const registerHref = redirect
    ? `/register?redirect=${encodeURIComponent(redirect)}`
    : "/register";

  return (
    <>
      <AuthTabs active="login" redirect={redirect} />
      <h1 className="font-display text-[30px] font-extrabold tracking-[-0.035em]">
        Welcome <span className="highlight">back</span>
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} aria-invalid={Boolean(errors.password)} />
          {errors.password && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <div className="flex items-center gap-3 text-xs font-bold text-subtle">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        OR
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <Button type="button" variant="outline" onClick={continueWithGoogle} className="w-full">
        <GoogleIcon />
        Continue with Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Hirebay?{" "}
        <Link href={registerHref} className="font-bold text-link">
          Create an account
        </Link>
      </p>
      <p className="text-center text-xs text-subtle">Google sign-ups start as Customers.</p>
    </>
  );
}
