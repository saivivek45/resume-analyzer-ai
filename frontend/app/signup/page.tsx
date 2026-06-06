"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthShell } from "@/components/auth-shell";
import { FormField } from "@/components/form-field";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusMessage } from "@/components/status-message";
import api, { getApiErrorMessage } from "@/src/lib/api";

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must contain at least 2 characters"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignupValues): Promise<void> {
    setApiError("");
    setSuccessMessage("");
    try {
      await api.post("/auth/signup", {
        full_name: values.fullName,
        email: values.email,
        password: values.password,
      });
      setSuccessMessage("Account created. Taking you to sign in...");
      window.setTimeout(() => router.replace("/login"), 1200);
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error, "Signup failed. Please try again."));
    }
  }

  return (
    <AuthShell
      description="Create your account and get clear, actionable resume feedback."
      footerHref="/login"
      footerLinkText="Sign in"
      footerText="Already have an account?"
      title="Start your career upgrade"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && <StatusMessage type="error">{apiError}</StatusMessage>}
        {successMessage && <StatusMessage type="success">{successMessage}</StatusMessage>}
        <FormField autoComplete="name" error={errors.fullName} label="Full name" placeholder="Alex Morgan" registration={register("fullName")} />
        <FormField autoComplete="email" error={errors.email} label="Email address" placeholder="you@example.com" registration={register("email")} type="email" />
        <FormField autoComplete="new-password" error={errors.password} label="Password" placeholder="At least 8 characters" registration={register("password")} type="password" />
        <FormField autoComplete="new-password" error={errors.confirmPassword} label="Confirm password" placeholder="Enter your password again" registration={register("confirmPassword")} type="password" />
        <button className="button-primary button-large mt-2 w-full" disabled={isSubmitting || Boolean(successMessage)} type="submit">
          {isSubmitting && <LoadingSpinner />}
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
