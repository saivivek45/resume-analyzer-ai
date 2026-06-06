"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthLoading } from "@/components/auth-loading";
import { useAuth } from "@/components/auth-provider";
import { AuthShell } from "@/components/auth-shell";
import { FormField } from "@/components/form-field";
import { LoadingSpinner } from "@/components/loading-spinner";
import { StatusMessage } from "@/components/status-message";
import api, { getApiErrorMessage } from "@/src/lib/api";
import type { AuthResponse } from "@/src/lib/auth";

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code"),
});

type OTPValues = z.infer<typeof otpSchema>;

function OTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { user, isLoading, setAuthenticatedUser } = useAuth();
  const [apiError, setApiError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    } else if (!isLoading && !email) {
      router.replace("/signup");
    }
  }, [email, isLoading, router, user]);

  async function onSubmit(values: OTPValues): Promise<void> {
    setApiError("");
    try {
      const { data } = await api.post<AuthResponse>("/auth/verify-otp", {
        email,
        otp: values.otp,
      });
      setAuthenticatedUser(data.user);
      router.replace("/dashboard");
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error, "Verification failed."));
    }
  }

  if (isLoading || user || !email) {
    return <AuthLoading />;
  }

  return (
    <AuthShell
      description={`We sent a 6-digit verification code to ${email}. It expires in 10 minutes.`}
      footerHref="/signup"
      footerLinkText="Start again"
      footerText="Need to use a different email?"
      title="Verify your email"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {apiError && <StatusMessage type="error">{apiError}</StatusMessage>}
        <FormField
          autoComplete="one-time-code"
          error={errors.otp}
          inputMode="numeric"
          label="Verification code"
          maxLength={6}
          placeholder="000000"
          registration={register("otp")}
        />
        <button className="button-primary button-large w-full" disabled={isSubmitting} type="submit">
          {isSubmitting && <LoadingSpinner />}
          {isSubmitting ? "Verifying..." : "Verify and create account"}
        </button>
      </form>
    </AuthShell>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <OTPForm />
    </Suspense>
  );
}
