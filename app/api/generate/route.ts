import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
    if (!apiKey) {
    return NextResponse.json({ error: "Higgsfield credentials are not configured on the server." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt || prompt.length > 4000) {
      return NextResponse.json({ error: "Enter a prompt between 1 and 4,000 characters." }, { status: 400 });
    }

    const upstream = await fetch("https://api.higgsfield.ai/bytedance/seedance-2.0/text-to-video", {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        resolution: "720p",
        generate_audio: false,
        duration: 5,
        aspect_ratio: "16:9"
      }),
      cache: "no-store"
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return NextResponse.json({ error: data?.message || data?.detail || "Higgsfield rejected the request.", details: data }, { status: upstream.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Could not submit the generation request." }, { status: 500 });
  }
}
