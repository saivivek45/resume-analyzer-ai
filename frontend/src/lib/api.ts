import axios, { AxiosError } from "axios";

interface FastApiError {
  detail?: string | Array<{ msg: string }>;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!(error instanceof AxiosError)) {
    return fallback;
  }

  const data = error.response?.data as FastApiError | undefined;

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
    return data.detail[0].msg;
  }

  if (!error.response) {
    return "Unable to connect to the server. Please check that the API is running.";
  }

  return fallback;
}

export default api;