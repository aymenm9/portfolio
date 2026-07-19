# AGENTS.md

Single-page React 19 + Vite portfolio styled as a Linux desktop. No tests, no TypeScript, no CI. Plain JSX + CSS (no Tailwind, no state library).

## Commands

- `npm run dev` — dev server. App is served at `http://localhost:5173/portfolio/`, **not** `/`.
- `npm run build` / `npm run preview`
- `npm run lint` — the only automated check; run it before considering work done. Currently reports ~11 pre-existing errors (mostly unused imports/vars, one `no-dupe-keys` in `fileSystem.js`) — don't assume you caused them; diff against this baseline.
- `npm run deploy` — builds and pushes `dist/` to the `gh-pages` branch (via `gh-pages` package). Live at https://aymenm9.github.io/portfolio/.

## Base path is `/portfolio/` — keep three places in sync

- `vite.config.js` → `base: "/portfolio/"`
- `App.jsx` → `<BrowserRouter basename="/portfolio">`
- `package.json` → `homepage`

Changing one without the others breaks dev or deploy.

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
