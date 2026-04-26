# TP_Umbrella_EDL (GitHub Pages)

This project is configured to deploy the **frontend** to **GitHub Pages** using **GitHub Actions**.

## Live URL

After Pages is enabled, your site will be available at:

`https://<your-github-username>.github.io/<repo-name>/`

For this repo name, that’s typically:

`https://arunaharikant.github.io/TP_Umbrella_EDL/`

## Deploy (one-time setup)

1. Push to the `main` branch (already configured).
2. In GitHub, open the repository → **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** = **GitHub Actions**.
4. Go to **Actions** tab and wait for the workflow **Deploy to GitHub Pages** to finish.

## Notes / Common issues

- **Blank page / missing CSS/JS**: this project uses Vite `base` + Wouter router base so it works under `/<repo-name>/`. If you rename the repo, redeploy (the workflow auto-detects the repo name).
- **404 on refresh** (single-page apps): the workflow copies `index.html` → `404.html` so client-side routing can recover.
- **GitHub Pages only hosts static files**: backend routes in `server/` won’t run on Pages. If the app needs an API, host the backend separately (Render/Fly.io/Railway/etc.) and point the frontend to it.

## Local build (optional)

On Windows PowerShell, if `npm` is blocked by execution policy, use `npm.cmd`:

- Install: `npm.cmd ci`
- Build: `npx.cmd vite build`

The built static site output is written to `dist/public`.
