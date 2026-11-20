
"use client";

import { useState } from "react";

type Job = {
  request_id?: string;
  status?: string;
  video?: { url?: string };
  error?: string;
};

type Mode = "text" | "image";

const GENI_IMAGE =
  "/brand-assets/gljr-geni-v02-master.png";

export default function Home() {
  const [mode, setMode] = useState<Mode>("image");

  const [prompt, setPrompt] = useState(
    "GENI, the friendly little inventor robot, " +
    "waves enthusiastically at the camera inside " +
    "a colorful futuristic science laboratory. " +
    "Gentle cinematic camera movement, playful " +
    "3D animation, expressive glowing eyes. " +
    "Preserve GENI's exact character design, " +
    "colors, proportions, and outfit."
  );

  const [job, setJob] = useState<Job | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    "No generation submitted yet."
  );

  async function generate() {
    setBusy(true);
    setJob(null);
    setMessage("Submitting your scene to Higgsfield...");

    try {
      const endpoint =
        mode === "image"
          ? "/api/image-to-video"
          : "/api/generate";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : JSON.stringify(data.error || data.details ||
                "Generation request failed.")
        );
      }

      setJob(data);
      setMessage(
        "Request submitted. Check its progress below."
      );
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Something went wrong."
      );
    } finally {
      setBusy(false);
    }
  }

  async function checkStatus() {
    if (!job?.request_id) return;

    setBusy(true);
    setMessage("Checking generation status...");

    try {
      const res = await fetch(
        `/api/status?id=${encodeURIComponent(job.request_id)}`
      );

      const data: Job = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Could not check status."
        );
      }

      setJob(data);
      setMessage(
        `Generation status: ${data.status || "unknown"}`
      );
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Status check failed."
      );
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setJob(null);
    setMessage("Ready to generate a new scene.");
  }

  return (
    <main>
      <div className="eyebrow">
        GENIUS LAB JR. · CREATOR STUDIO
      </div>

      <h1>Big Ideas. Bigger Imagination.</h1>

      <p className="sub">
        A private production workspace for creating
        animated scenes. Videos remain drafts until
        you review and approve them.
      </p>

      <section className="panel">
        <h2>Choose generation mode</h2>

        <div style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}>
          <button
            type="button"
            onClick={() => changeMode("text")}
            disabled={busy}
            aria-pressed={mode === "text"}
            style={{
              opacity: mode === "text" ? 1 : 0.65
            }}
          >
            Text-to-Video
          </button>

          <button
            type="button"
            onClick={() => changeMode("image")}
            disabled={busy}
            aria-pressed={mode === "image"}
            style={{
              opacity: mode === "image" ? 1 : 0.65
            }}
          >
            GENI V2 Image-to-Video
          </button>
        </div>

        {mode === "image" && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Official GENI V2 Reference</h3>

            <img
              src={GENI_IMAGE}
              alt="Official GENI V2 mascot"
              style={{
                width: "100%",
                maxWidth: "450px",
                borderRadius: "12px"
              }}
            />

            <p className="small">
              Higgsfield will use this image as
              the starting frame of your animation.
            </p>
          </div>
        )}

        <label htmlFor="prompt">
          Describe your scene
        </label>

        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
        />

        <button
          type="button"
          onClick={generate}
          disabled={busy || !prompt.trim()}
        >
          {busy
            ? "Working..."
            : mode === "image"
              ? "Generate GENI V2 Video"
              : "Generate Text-to-Video"}
        </button>

        <div className="status" role="status">
          {message}
        </div>

        {job?.request_id && (
          <div className="status">
            <p>
              <strong>Request ID:</strong>{" "}
              {job.request_id}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {job.status || "submitted"}
            </p>

            <button
              type="button"
              onClick={checkStatus}
              disabled={busy}
            >
              Check status
            </button>
          </div>
        )}

        {job?.video?.url && (
          <div>
            <h2>Generated scene</h2>

            <video
              controls
              src={job.video.url}
              style={{ width: "100%" }}
            />

            <p className="small">
              Review the clip before using it in
              an episode. Higgsfield output links
              may expire, so save approved videos
              to your own storage.
            </p>
          </div>
        )}
      </section>

      <p className="small">
        Safety gate: All output is a draft.
        Review scenes, audio, and child-directed
        content before public release.
      </p>
    </main>
  );
}
