import { NextResponse } from "next/server";

interface StoreResumePayload {
  text?: string;
  fileName?: string;
  userEmail?: string;
}

const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request: Request) {
  const payload = (await request.json()) as StoreResumePayload;

  if (!payload.text?.trim()) {
    return NextResponse.json({ detail: "Resume text is required." }, { status: 400 });
  }

  const response = await fetch(`${backendUrl}/resume/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: payload.text,
      file_name: payload.fileName,
      user_email: payload.userEmail,
    }),
  });

  const data = (await response.json()) as unknown;

  return NextResponse.json(data, { status: response.status });
}
