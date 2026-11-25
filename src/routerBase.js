// Vite's `base` ('/portfolio/' on GitHub Pages, '/' on Vercel — see base.config.js) without the trailing slash
export const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
