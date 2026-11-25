// Build-time only: renders a route to static HTML for scripts/prerender.js. Never shipped to the browser.
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import { AppContent } from './App.jsx'
import { ROUTER_BASENAME } from './routerBase.js'

export async function render(url) {
  // prerender (unlike renderToString) waits for the lazy() route chunks to resolve
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter basename={ROUTER_BASENAME} location={url}>
        <AppContent />
      </StaticRouter>
    </StrictMode>
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}
