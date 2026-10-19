"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";

type LoginFormData = {
  email: string;
  password: string;
};

// Keep in sync with Supabase -> Authentication -> Providers -> Email -> minimum password length.
const MIN_PASSWORD = 8;

const inputClass = (invalid: boolean) =>
  `w-full min-h-11 rounded-control border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
    invalid ? "border-destructive" : "border-input focus-visible:border-ring"
  }`;

/** One message for wrong email and wrong password alike, so the form never reveals which emails have accounts. */
function friendlyError(code: string | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return "Incorrect email or password";
    case "email_not_confirmed":
      return "This account needs email confirmation. Ask the admin to turn off \"Confirm email\" in Supabase.";
    case "over_request_rate_limit":
      return "Too many attempts. Wait a minute and try again.";
    default:
      return "Couldn't log in. Check your connection and try again.";
  }
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) throw error;

      router.replace("/tasks");
      router.refresh();
    } catch (err) {
      setServerError(friendlyError((err as { code?: string }).code));
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8 sm:justify-center sm:py-12">
      <p className="mb-6 text-base font-bold tracking-tight">My Work List</p>

      <div className="w-full max-w-110 rounded-card border border-border bg-card p-5 shadow-panel sm:p-8">
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">Welcome back</p>
          <h1 className="text-page-title font-bold">Log in to your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Please enter your details to sign in.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {serverError && (
            <div role="alert" className="flex items-start gap-2 rounded-control bg-error-muted p-3 text-xs text-t1-red-700">
              <AlertCircle aria-hidden className="size-4 shrink-0" />
              <p>{serverError}</p>
            </div>
          )}

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", {
                required: "Enter your email address",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
              })}
              type="email"
              id="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(!!errors.email)}
              placeholder="you@example.com"
            />
            {errors.email && <p id="email-error" className="text-xs text-t1-red-700">{errors.email.message}</p>}
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold" htmlFor="password">
              Password
            </label>
            <input
              {...register("password", {
                required: "Enter a password",
                minLength: { value: MIN_PASSWORD, message: `Password must be at least ${MIN_PASSWORD} characters` },
              })}
              type="password"
              id="password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby="password-hint"
              className={inputClass(!!errors.password)}
              placeholder="Enter your password"
            />
            <p id="password-hint" className={`text-xs ${errors.password ? "text-t1-red-700" : "text-muted-foreground"}`}>
              {errors.password?.message ?? `At least ${MIN_PASSWORD} characters`}
            </p>
          </div>

        

          <button
            type="submit"
            disabled={isLoading}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:bg-muted disabled:text-t1-gray-500"
          >
            {isLoading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="rounded-sm font-semibold text-accent-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
