import { useEffect, useRef, useState } from 'react'
import { Atlas } from './Atlas.tsx'
import type { Facet } from './data.ts'
import { pageMeta } from './head.ts'
import { RouteProvider, absolutePath, routeKey, routePath, useCurrentRoute } from './route.tsx'
import { About, Home, Resume, SiteNav, WorkIndex } from './Views.tsx'
import { Story } from './Story.tsx'
import { World } from './World.tsx'

export function App({ initialPath }: { initialPath?: string }) {
  return (
    <RouteProvider initialPath={initialPath}>
      <Shell />
    </RouteProvider>
  )
}

function Shell() {
  const route = useCurrentRoute()
  const [facet, setFacet] = useState<Facet | 'all'>('all')
  const immersive = route.name === 'explore'
  const booted = useRef(false)
  useEffect(() => {
    booted.current = true
  }, [])
  const fallback = booted.current && fallbackMotion()
  return (
    <div className={immersive ? 'app app-walk' : 'app app-folio'}>
      <a className="skip" href="#main">Skip to content</a>
      {immersive ? null : <SiteNav />}
      <main id="main" tabIndex={-1} className={immersive ? 'main-walk' : undefined}>
        <div key={routeKey(route)} className={fallback ? 'route-stage route-enter' : 'route-stage'}>
          {route.name === 'overview' ? <Home /> : null}
          {route.name === 'work' ? <WorkIndex /> : null}
          {route.name === 'case' ? <Story id={route.id} /> : null}
          {route.name === 'about' ? <About /> : null}
          {route.name === 'resume' ? <Resume /> : null}
          {route.name === 'map' ? <Atlas facet={facet} query="" onFacet={setFacet} /> : null}
          {route.name === 'explore' ? <World /> : null}
        </div>
      </main>
      <HeadSync />
    </div>
  )
}

function fallbackMotion(): boolean {
  if (typeof document === 'undefined' || 'startViewTransition' in document) return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function setMeta(selector: string, value: string): void {
  const node = document.querySelector(selector)
  if (node) node.setAttribute('content', value)
}

function HeadSync() {
  const route = useCurrentRoute()
  useEffect(() => {
    const meta = pageMeta(routePath(route))
    document.title = meta.title
    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.title)
    setMeta('meta[property="og:description"]', meta.description)
    const canonicalUrl = `${location.origin}${absolutePath(routePath(route))}`
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (!ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrl)
    }
    ogUrl.setAttribute('content', canonicalUrl)
  }, [route])
  return null
}
