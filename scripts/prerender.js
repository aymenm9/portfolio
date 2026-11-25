// Post-build step: bakes the home page ("/") into dist/index.html as real HTML.
// The browser paints content (and crawlers read it) before any JS runs; React then hydrates it.
//   1. dist/404.html  ← untouched SPA shell (GitHub Pages fallback for /lock, /home, /project/:id)
//   2. dist/index.html ← shell + pre-rendered markup + the home route's lazy CSS/JS preloaded
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { BASE } from '../base.config.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')
const HOME_ENTRY = 'src/components/StandardPortfolio.jsx'

const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
fs.writeFileSync(path.join(dist, '404.html'), shell)

// Collect the CSS + JS chunks of the lazily-loaded home route from the client manifest,
// so its styles are present on first paint (no flash of unstyled HTML) and hydration starts sooner.
const manifestPath = path.join(dist, '.vite', 'manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const css = new Set()
const js = new Set()
const walk = (key, seen = new Set()) => {
  if (seen.has(key) || !manifest[key]) return
  seen.add(key)
  const chunk = manifest[key]
  if (!chunk.isEntry) js.add(chunk.file)
  chunk.css?.forEach((f) => css.add(f))
  chunk.imports?.forEach((k) => walk(k, seen))
}
if (!manifest[HOME_ENTRY]) throw new Error(`prerender: ${HOME_ENTRY} missing from manifest`)
walk(HOME_ENTRY)

const notInShell = (f) => !shell.includes(`${BASE}${f}`)
const head = [
  ...[...css].filter(notInShell).map((f) => `<link rel="stylesheet" crossorigin href="${BASE}${f}">`),
  ...[...js].filter(notInShell).map((f) => `<link rel="modulepreload" crossorigin href="${BASE}${f}">`),
].join('\n    ')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const appHtml = await render(BASE)
if (!appHtml.includes('std-portfolio')) throw new Error('prerender: home page did not render')

// Re-apply the visitor's saved theme to the static markup before first paint, so dark-mode
// visitors don't see a light flash and hydration sees the same data-theme React will use.
const themeFix = `<script>try{var t=localStorage.getItem('am-theme'),e=t&&document.querySelector('#root .std-portfolio');e&&e.setAttribute('data-theme',t)}catch(_){}</script>`

const marker = '<div id="root"></div>'
if (!shell.includes(marker) || !shell.includes('</head>')) throw new Error('prerender: unexpected index.html shape')
const out = shell
  .replace('</head>', `  ${head}\n  </head>`)
  .replace(marker, `<div id="root">${appHtml}</div>${themeFix}`)

fs.writeFileSync(path.join(dist, 'index.html'), out)
fs.rmSync(path.join(dist, '.vite'), { recursive: true, force: true })
fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerender: / → dist/index.html (${(appHtml.length / 1024).toFixed(1)} kB HTML, ${css.size} css, ${js.size} js preloaded)`)
