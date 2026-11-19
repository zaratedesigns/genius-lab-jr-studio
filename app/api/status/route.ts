import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const id = process.env.HF_API_KEY_ID;
  const secret = process.env.HF_API_KEY_SECRET;
  if (!id || !secret) {
    return NextResponse.json({ error: "Higgsfield credentials are not configured on the server." }, { status: 500 });
  }

  const requestId = new URL(req.url).searchParams.get("id");
  if (!requestId || !/^[a-zA-Z0-9_-]+$/.test(requestId)) {
    return NextResponse.json({ error: "A valid request ID is required." }, { status: 400 });
  }

  const upstream = await fetch(`https://api.higgsfield.ai/requests/${encodeURIComponent(requestId)}/status`, {
    headers: { "Authorization": `Key ${id}:${secret}` },
    cache: "no-store"
  });
  const data = await upstream.json();
  if (!upstream.ok) {
    return NextResponse.json({ error: data?.message || data?.detail || "Could not retrieve generation status.", details: data }, { status: upstream.status });
  }
  return NextResponse.json(data);
}
