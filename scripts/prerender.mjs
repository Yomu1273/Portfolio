import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const template = readFileSync(join(dist, 'index.html'), 'utf8')
const origin = (process.env.VITE_SITE_URL ?? '').replace(/\/$/, '')

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
const { PRERENDER_PATHS } = await vite.ssrLoadModule('/src/route.tsx')
await vite.close()

function prefixFor(pathname) {
  const depth = pathname.split('/').filter(Boolean).length
  return depth === 0 ? './' : '../'.repeat(depth)
}

function pageHtml(pathname, html, head) {
  const prefix = prefixFor(pathname)
  const withAssets = template.replaceAll('src="./', `src="${prefix}`).replaceAll('href="./', `href="${prefix}`)
  return withAssets
    .replace(/<!--head-->[\s\S]*?<!--\/head-->/, `<!--head-->\n    ${head}\n    <!--/head-->`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
}

for (const pathname of PRERENDER_PATHS) {
  const { html, head } = await render(pathname, origin)
  const file = pathname === '/'
    ? join(dist, 'index.html')
    : join(dist, ...pathname.split('/').filter(Boolean), 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, pageHtml(pathname, html, head))
  console.log(`Prerendered ${pathname}`)
}

if (origin) {
  const urls = PRERENDER_PATHS.map((pathname) => `${origin}${pathname === '/' ? '/' : pathname}`).join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PRERENDER_PATHS.map((pathname) => `  <url><loc>${origin}${pathname === '/' ? '/' : pathname}</loc></url>`).join('\n')}\n</urlset>\n`
  writeFileSync(join(dist, 'sitemap.xml'), body)
  const robots = readFileSync(fileURLToPath(new URL('../public/robots.txt', import.meta.url)), 'utf8').trim()
  writeFileSync(join(dist, 'robots.txt'), `${robots}\n\nSitemap: ${origin}/sitemap.xml\n`)
  console.log(`Sitemap\n${urls}`)
}
