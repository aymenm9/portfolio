import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/portfolio/",
  build: {
    // scripts/prerender.js reads the manifest to preload the home route's lazy CSS/JS
    manifest: true,
  },
})
