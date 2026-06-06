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
import { setToken, setUserEmail } from "@/src/lib/auth";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues): Promise<void> {
    setApiError("");
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", values);
      setToken(data.access_token);
      setUserEmail(values.email);
      router.replace("/dashboard");
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error, "Login failed. Please try again."));
    }
  }

  return (
    <AuthShell
      description="Welcome back. Sign in to continue building your strongest resume."
      footerHref="/signup"
      footerLinkText="Create an account"
      footerText="New to CareerPilot?"
      title="Sign in to your account"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && <StatusMessage type="error">{apiError}</StatusMessage>}
        <FormField autoComplete="email" error={errors.email} label="Email address" placeholder="you@example.com" registration={register("email")} type="email" />
        <FormField autoComplete="current-password" error={errors.password} label="Password" placeholder="Enter your password" registration={register("password")} type="password" />
        <button className="button-primary button-large w-full" disabled={isSubmitting} type="submit">
          {isSubmitting && <LoadingSpinner />}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
