import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// index.html ships the home page pre-rendered at build time (scripts/prerender.js) → hydrate it.
// 404.html (GitHub Pages SPA fallback for /lock, /home, /project/...) is an empty shell → render.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
