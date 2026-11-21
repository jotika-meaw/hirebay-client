"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/redirect";
import { PASSWORD_MESSAGE, passwordSchema } from "@/lib/validators";
import { uploadImage } from "@/lib/imgbb";
import AuthTabs from "@/components/auth/AuthTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name needs at least 2 characters").max(80),
  email: z.email("Enter a valid email address"),
  photo: z
    .string()
    .refine((v) => v === "" || /^https?:\/\/.+/.test(v), {
      message: "Paste a valid image link or upload one",
    }),
  role: z.enum(["rent", "list"]),
  password: passwordSchema,
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

function Rule({ ok, children }) {
  return (
    <span className={cn("font-semibold", ok ? "text-success" : "text-danger")}>
      {ok ? "✓" : "✕"} {children}
    </span>
  );
}

export default function RegisterForm({ redirect, initialRole }) {
  const router = useRouter();
  const target = safeRedirect(redirect);
  const { data: session, isPending } = authClient.useSession();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  // Local mirrors for the live password checklist and photo preview.
  // (RHF `watch()` trips the React Compiler lint, so inputs forward here.)
  const [pwValue, setPwValue] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!isPending && session?.user) router.replace(target);
  }, [isPending, session, router, target]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      photo: "",
      role: initialRole === "owner" ? "list" : "rent",
      password: "",
    },
  });

  const passwordReg = register("password");
  const photoReg = register("photo");

  const hasUpper = /[A-Z]/.test(pwValue);
  const hasLower = /[a-z]/.test(pwValue);
  const hasMin6 = pwValue.length >= 6;

  if (!isPending && session?.user) return null;

  function onInvalid(formErrors) {
    if (formErrors.password) toast.error(PASSWORD_MESSAGE);
  }

  async function onSubmit(values) {
    const { data, error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.photo || undefined,
      accountType: values.role === "list" ? "owner" : "customer",
      callbackURL: target,
    });
    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }
    toast.success("Account created!", {
      description: `You're logged in${data?.user?.role === "owner" ? " as an owner" : ""}.`,
    });
    router.push(target);
    router.refresh();
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("photo", url, { shouldValidate: true });
      setPreview(url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function continueWithGoogle() {
    authClient.signIn.social({ provider: "google", callbackURL: target });
  }

  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";

  return (
    <>
      <AuthTabs active="register" redirect={redirect} />
      <h1 className="font-display text-[30px] font-extrabold tracking-[-0.035em]">
        Create your <span className="highlight">account</span>
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" type="text" autoComplete="name" {...register("name")} aria-invalid={Boolean(errors.name)} />
          {errors.name && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
          {errors.email && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="photo">Photo</Label>
          <div className="flex gap-2">
            <Input
              id="photo"
              type="url"
              placeholder="Paste a direct image link"
              {...photoReg}
              onChange={(e) => {
                photoReg.onChange(e);
                setPreview(e.target.value);
              }}
              aria-invalid={Boolean(errors.photo)}
              className="flex-1"
            />
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="sr-only" aria-label="Upload photo via imgbb" />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex-none rounded-xl text-[13px]">
              <Upload className="size-4" aria-hidden="true" />
              {uploading ? "Uploading…" : "Upload · imgbb"}
            </Button>
          </div>
          {errors.photo && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.photo.message}</p>}
          {preview.startsWith("http") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Profile photo preview" className="mt-1 size-16 rounded-2xl border border-border object-cover" />
          )}
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">I want to</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-[14px] border border-border bg-card p-3 text-sm font-semibold has-checked:border-foreground">
              <input type="radio" value="rent" {...register("role")} className="size-4 accent-brand" />
              Rent equipment
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-[14px] border border-border bg-card p-3 text-sm font-semibold has-checked:border-foreground">
              <input type="radio" value="list" {...register("role")} className="size-4 accent-brand" />
              List equipment
            </label>
          </div>
        </fieldset>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...passwordReg}
            onChange={(e) => {
              passwordReg.onChange(e);
              setPwValue(e.target.value);
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby="pw-rules"
          />
          {errors.password && <p role="alert" className="text-[13px] font-semibold text-danger">{errors.password.message}</p>}
          <div id="pw-rules" className="flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
            <Rule ok={hasUpper}>One uppercase letter</Rule>
            <Rule ok={hasLower}>One lowercase letter</Rule>
            <Rule ok={hasMin6}>At least 6 characters</Rule>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create account"}
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
        Already have an account?{" "}
        <Link href={loginHref} className="font-bold text-link">
          Log in
        </Link>
      </p>
      <p className="text-center text-xs text-subtle">Google sign-ups start as Customers.</p>
    </>
  );
}
