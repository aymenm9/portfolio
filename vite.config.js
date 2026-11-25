import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BASE } from './base.config.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // "/portfolio/" for GitHub Pages, "/" on Vercel — see base.config.js
  base: BASE,
  build: {
    // scripts/prerender.js reads the manifest to preload the home route's lazy CSS/JS
    manifest: true,
  },
})
