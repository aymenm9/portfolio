# AGENTS.md

Single-page React 19 + Vite portfolio styled as a Linux desktop. No tests, no TypeScript, no CI. Plain JSX + CSS (no Tailwind, no state library).

## Commands

- `npm run dev` — dev server. App is served at `http://localhost:5173/portfolio/`, **not** `/`.
- `npm run build` / `npm run preview` — build is 3 steps: client build → SSR build of `src/entry-server.jsx` into `dist-ssr/` → `scripts/prerender.js` (see below).
- `npm run lint` — the only automated check; run it before considering work done. Currently reports ~11 pre-existing errors (mostly unused imports/vars, one `no-dupe-keys` in `fileSystem.js`) — don't assume you caused them; diff against this baseline.
- `npm run deploy` — builds and pushes `dist/` to the `gh-pages` branch (via `gh-pages` package). Live at https://aymenm9.github.io/portfolio/.

## Base path — `/portfolio/` on GitHub Pages, `/` on Vercel

The site deploys to two places from the same code:
- **GitHub Pages** (`npm run deploy`) → https://aymenm9.github.io/portfolio/ → base `/portfolio/` (the default).
- **Vercel** (`vercel.json`, Git-connected) → domain root → base `/`. Vercel sets `VERCEL=1` during builds.

`base.config.js` is the single source of truth (`BASE_PATH=/x/` overrides). It feeds `vite.config.js` and `scripts/prerender.js`; app code derives everything from `import.meta.env.BASE_URL` (`ROUTER_BASENAME` in `App.jsx` for the routers, `presentation` URLs in `src/data/projects.js`). **Never hardcode `/portfolio/` in app code.** `package.json` `homepage` is GitHub Pages-only metadata. The canonical/OG URLs in `index.html` are absolute and intentionally point to the GitHub Pages site.

On Vercel, `vercel.json` rewrites unknown paths to `/404.html` (the SPA shell) — files on disk win, so `/` still serves the pre-rendered `index.html`.

## Pre-rendered home page (performance + SEO)

`/` is baked into `dist/index.html` as real HTML at build time, then hydrated (`hydrateRoot` in `main.jsx`). `scripts/prerender.js`:
- writes `dist/404.html` from the **untouched** shell first — GitHub Pages serves it for `/lock`, `/home`, `/project/:id`, and `main.jsx` falls back to `createRoot` when `#root` is empty. Never copy the pre-rendered `index.html` to `404.html`.
- injects the lazy `StandardPortfolio` route's CSS/JS (from `dist/.vite/manifest.json`) into `<head>` so there's no unstyled flash.
- adds an inline script that re-applies the saved `am-theme` to the static markup before paint.

Rules for anything rendered on `/` (StandardPortfolio and what it imports at module level):
- No `window` / `document` / `localStorage` during render or in `useState` initializers — only inside `useEffect` / handlers (guard with `typeof x !== 'undefined'` if unavoidable). The build fails loudly otherwise.
- First render must be deterministic (no `Math.random()` / `Date.now()` in JSX) or hydration mismatches.
- SEO tags (title, description, Open Graph, JSON-LD Person) live in `index.html`; `public/og-image.png` (1200×630) and `public/sitemap.xml` are the social preview and sitemap.

## App structure (one app, two UIs)

Routes in `App.jsx`:
- `/` → `StandardPortfolio.jsx` (normal scrollable portfolio)
- `/lock` → `lockScreen.jsx`, `/home` → `homeScreen.jsx` (the desktop-environment UI: taskbar, draggable terminal/project windows via `react-draggable`)

`ChatBot` is mounted in `App.jsx` but **gated to the OS routes** (`/lock`, `/home`) via `useLocation` — it must NOT render on `/`. It points at a hardcoded external API (`https://portfolio-chatbot-92au.onrender.com`). The `fetch` on mount in `App.jsx` is an intentional cold-start wake-up for the Render free tier — do not remove it as "dead code".

## Standard-portfolio project viewer (separate from the OS one)

`StandardPortfolio.jsx` uses its own `ProjectViewer.jsx` — NOT the OS `project.jsx` popup (that one stays for the desktop UI). Render priority: (1) HTML presentation → (2) markdown resource → (3) image → (4) description. Presentations are plain HTML folders under `public/presentations/<project-id>/` (relative asset paths work because `public/` keeps its structure) and are enabled by adding `presentation: "/portfolio/presentations/<id>/index.html"` to the project's entry in `src/data/projects.js` — the field rides into the FS node via `...projectMeta` spread, no `fileSystem.js` change needed. Example: `public/presentations/tajweed-ai/`.

## Virtual file system (the terminal's core)

The desktop terminal (`terminal.jsx`, `terminalCommand.jsx`, commands implemented in `components/utils.jsx`: `ls`, `cd`, `cat`, `open`, `help`) navigates a fake FS built at module load in `src/fileSystem.js`:

- Files are discovered with `import.meta.glob('./assets/desktop/**/*', { eager: true })` — real files live under `src/assets/desktop/` (Resume/, Certificates/, Skills/, Work_Experience/, Projects/).
- Project metadata lives in `src/data/projects.js`.
- **Adding a project requires THREE edits**: (1) drop assets in `src/assets/desktop/Projects/<id>_resource/`, (2) add an entry to `src/data/projects.js`, (3) add the project to the hardcoded `Projects` map in `fileSystem.js` (step 2 alone does nothing).
- File type is inferred by extension in `getFileType()`: images, `md`/`txt` → markdown, `pdf`. `open` on markdown/PDF/image renders it via `project.jsx` / `projectViews.jsx`.
- File lookup uses `key.endsWith(pathSuffix)`, so filenames must be unique enough to match unambiguously.

## Conventions & gotchas

- ESLint flat config (`eslint.config.js`): `no-unused-vars` is an **error**, but variables starting with an uppercase letter or `_` are exempt (`varsIgnorePattern: '^[A-Z_]'`) — unused React component imports pass lint. Remove them anyway when cleaning up.
- Several components return JSX from non-component helper functions (e.g. `ls()`, `help()` in `utils.jsx`) — existing style; not a bug to "fix".
- `public/` holds images/PDFs/markdown referenced by absolute `/portfolio/...` URLs at runtime; `src/assets/` files go through Vite's bundler. Don't move files between the two without checking how they're referenced.
- Windows (terminal/project) are plain `useState` in `homeScreen.jsx` — there is no window manager abstraction.
