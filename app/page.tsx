"use client";

import { useState } from "react";

type Job = { request_id?: string; status?: string; video?: { url?: string }; error?: string };

export default function Home() {
  const [prompt, setPrompt] = useState("A friendly little inventor robot named GENI welcomes children into a colorful 3D animated science lab. Bright, warm, playful, family-friendly, expressive character animation. No text on screen.");
  const [job, setJob] = useState<Job | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("No generation submitted yet.");

  async function generate() {
    setBusy(true); setJob(null); setMessage("Submitting your scene to Higgsfield...");
    try {
      const res = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation request failed.");
      setJob(data); setMessage("Request submitted. You can check its progress below.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  async function checkStatus() {
    if (!job?.request_id) return;
    setBusy(true); setMessage("Checking generation status...");
    try {
      const res = await fetch(`/api/status?id=${encodeURIComponent(job.request_id)}`);
      const data: Job = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not check status.");
      setJob(data);
      setMessage(`Generation status: ${data.status || "unknown"}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Status check failed.");
    } finally { setBusy(false); }
  }

  return <main>
    <div className="eyebrow">GENIUS LAB JR. · CREATOR STUDIO</div>
    <h1>Big Ideas. Bigger Imagination.</h1>
    <p className="sub">A private production workspace for creating animated scenes. This starter only generates and previews a scene; it does not publish anything to YouTube.</p>
    <section className="panel">
      <label htmlFor="prompt">Describe your scene</label>
      <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={generate} disabled={busy || !prompt.trim()}>{busy ? "Working..." : "Generate scene"}</button>
      <div className="status" role="status">{message}</div>
      {job?.request_id && <div className="status">
        <p><strong>Request ID:</strong> {job.request_id}</p>
        <p><strong>Status:</strong> {job.status || "submitted"}</p>
        <button onClick={checkStatus} disabled={busy}>Check status</button>
      </div>}
      {job?.video?.url && <div>
        <h2>Generated scene</h2>
        <video controls src={job.video.url} />
        <p className="small">Review this clip before adding it to an episode. Higgsfield-hosted output links are temporary; download approved assets to your own storage.</p>
      </div>}
    </section>
    <p className="small">Safety gate: all output is a draft. You must review the scene, audio, and child-directed content before any public release.</p>
  </main>;
}
