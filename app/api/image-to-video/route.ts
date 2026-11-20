
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const apiKey = process.env.HIGGSFIELD_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Higgsfield API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const prompt =
      typeof body.prompt === "string"
        ? body.prompt.trim()
        : "";

    if (prompt.length > 4000) {
      return NextResponse.json(
        { error: "Prompt is too long." },
        { status: 400 }
      );
    }

    const origin = new URL(req.url).origin;

    const imageUrl =
      `${origin}/brand-assets/gljr-geni-v02-master.png`;

    const upstream = await fetch(
      "https://api.higgsfield.ai/bytedance/seedance-2.5/image-to-video",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt,
          resolution: "720p",
          duration: 5,
          aspect_ratio: "16:9",
          generate_audio: false,
        }),
        cache: "no-store",
      }
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.detail ||
            "Higgsfield rejected the request.",
          details: data,
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Image-to-video request failed." },
      { status: 500 }
    );
  }
}
