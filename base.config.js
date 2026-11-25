/* global process */
// Single source of truth for the URL base path, shared by vite.config.js and scripts/prerender.js.
//   GitHub Pages (default, `npm run deploy`) → "/portfolio/"  (https://aymenm9.github.io/portfolio/)
//   Vercel (sets VERCEL=1 during its builds) → "/"            (served at the domain root)
//   BASE_PATH=/x/ overrides both.
export const BASE = process.env.BASE_PATH || (process.env.VERCEL ? '/' : '/portfolio/')
