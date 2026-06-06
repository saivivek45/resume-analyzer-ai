const TOKEN_KEY = "careerpilot_access_token";
const EMAIL_KEY = "careerpilot_user_email";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function getToken(): string | null {
  return canUseStorage() ? window.localStorage.getItem(TOKEN_KEY) : null;
}

export function setToken(token: string): void {
  if (canUseStorage()) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken(): void {
  if (canUseStorage()) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(EMAIL_KEY);
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getUserEmail(): string | null {
  return canUseStorage() ? window.localStorage.getItem(EMAIL_KEY) : null;
}

export function setUserEmail(email: string): void {
  if (canUseStorage()) {
    window.localStorage.setItem(EMAIL_KEY, email);
  }
}
