"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import api, { getApiErrorMessage } from "@/src/lib/api";
import type { AuthResponse } from "@/src/lib/auth";
import { useAuth } from "@/components/auth-provider";

interface GoogleLoginButtonProps {
  onError: (message: string) => void;
}

export function GoogleLoginButton({ onError }: GoogleLoginButtonProps) {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuth();
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  console.log(
  "GOOGLE CLIENT ID:",
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
);
  if (!googleClientId) {
    return null;
  }

  

  return (
    <div className="flex justify-center overflow-hidden rounded-xl">
      <GoogleLogin
        onError={() => onError("Google sign-in was cancelled or failed.")}
        onSuccess={async ({ credential }) => {
          if (!credential) {
            onError("Google did not return a valid credential.");
            return;
          }
          try {
            const { data } = await api.post<AuthResponse>("/auth/google", {
              credential,
            });
            setAuthenticatedUser(data.user);
            router.replace("/dashboard");
          } catch (error: unknown) {
            onError(getApiErrorMessage(error, "Google sign-in failed."));
          }
        }}
        shape="rectangular"
        size="large"
        text="continue_with"
        theme="filled_black"
        width="360"
      />
    </div>
  );
}
