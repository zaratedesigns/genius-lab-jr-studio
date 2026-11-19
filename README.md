# Genius Lab Jr. Studio — starter

This is a minimal Next.js + Vercel starter for submitting a text-to-video request to Higgsfield and checking its status.

## 1. Create a GitHub repository

Create an empty private repository named `genius-lab-jr-studio`, then upload these files or push this folder.

## 2. Deploy to Vercel

Import the private GitHub repository at https://vercel.com/new. Keep the framework preset as Next.js.

## 3. Add server-side environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `HF_API_KEY_ID` — your Higgsfield API key ID
- `HF_API_KEY_SECRET` — your Higgsfield API key secret

Higgsfield's current REST authentication uses `Authorization: Key KEY_ID:KEY_SECRET`. Do not put either value in a `NEXT_PUBLIC_` variable. Redeploy after adding or changing environment variables.

## 4. Test privately

Open the deployed site, submit one short test prompt, and click Check status until the request completes. Confirm the clip appears. This starter uses the official Seedance 2.0 text-to-video example route and 720p, 5 seconds, 16:9, no generated audio.

## Important limitations of this starter

- It is a generation smoke test, not the complete production dashboard.
- It does not yet save project history, upload reference images, assemble multi-scene episodes, or connect YouTube.
- It does not automatically publish anything.
- The browser can currently request status for a request ID; before sharing this app with other users, add authentication, a database, and ownership checks for every request.
- Verify the selected model's current schema and availability in your Higgsfield API catalog before production use.
- Download completed output into your own storage promptly; provider-hosted outputs are temporary.

## Local development

Run `npm install`, copy `.env.example` to `.env.local`, fill the two server-only values, then run `npm run dev`.
