import { flushSync } from 'react-dom'
import { createContext, useContext, useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { NODES, findNode } from './data.ts'

export type Route =
  | { name: 'explore' }
  | { name: 'overview' }
  | { name: 'work' }
  | { name: 'case'; id: string }
  | { name: 'about' }
  | { name: 'resume' }
  | { name: 'map' }

const NAV_EVENT = 'folio:nav'

export function canonicalPath(to: string): string {
  const raw = to.replace(/^#/, '').split('?')[0]?.split('#')[0] ?? '/'
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`
  const trimmed = withSlash.replace(/\/+$/, '') || '/'
  return trimmed === '/' ? '/' : `${trimmed}/`
}

export function parsePath(pathname: string): Route {
  const path = canonicalPath(pathname)
  if (path === '/' || path === '/explore/' || path === '/atlas/') return { name: 'explore' }
  if (path === '/overview/' || path === '/home/' || path === '/signal/') return { name: 'overview' }
  if (path === '/work/') return { name: 'work' }
  if (path === '/about/') return { name: 'about' }
  if (path === '/resume/' || path === '/brief/') return { name: 'resume' }
  if (path === '/map/' || path === '/survey/' || path === '/index/') {
    return path === '/index/' ? { name: 'work' } : { name: 'map' }
  }
  const work = /^\/work\/([a-z0-9-]+)\/$/.exec(path)
  if (work) {
    const node = NODES.find((item) => item.path === `work/${work[1]}`)
    if (node) return { name: 'case', id: node.id }
  }
  const legacy = /^\/n\/([a-z-]+)\/$/.exec(path)
  if (legacy && findNode(legacy[1])) return { name: 'case', id: legacy[1] }
  return { name: 'explore' }
}

export function routePath(route: Route): string {
  if (route.name === 'explore') return '/'
  if (route.name === 'overview') return '/overview/'
  if (route.name === 'work') return '/work/'
  if (route.name === 'about') return '/about/'
  if (route.name === 'resume') return '/resume/'
  if (route.name === 'map') return '/map/'
  const node = findNode(route.id)
  return node ? `/${node.path}/` : '/work/'
}

let cachedBase: string | null = null

export function detectBase(): string {
  if (typeof document === 'undefined') return '/'
  if (cachedBase) return cachedBase
  const script = document.querySelector('script[type="module"]')
  const src = script instanceof HTMLScriptElement ? script.src : ''
  const pathname = src ? new URL(src).pathname : ''
  const at = pathname.indexOf('/assets/')
  cachedBase = at > 0 ? pathname.slice(0, at + 1) : '/'
  return cachedBase
}

function stripBase(pathname: string): string {
  const base = detectBase()
  if (base !== '/' && pathname.startsWith(base)) return pathname.slice(base.length - 1) || '/'
  return pathname || '/'
}

function legacyHash(hash: string): string | null {
  const raw = hash.replace(/^#/, '')
  if (!raw.startsWith('/')) return null
  return canonicalPath(raw)
}

export function parseLocation(): Route {
  return parsePath(stripBase(window.location.pathname))
}

export function absolutePath(to: string): string {
  const path = canonicalPath(to)
  const base = detectBase()
  return base === '/' ? path : `${base.replace(/\/$/, '')}${path}`
}

function jumpTop(): void {
  const root = document.documentElement
  const previous = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  root.style.scrollBehavior = previous
}

export function routeKey(route: Route): string {
  return route.name === 'case' ? `case:${route.id}` : route.name
}

function motionAllowed(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function navigate(to: string, mode: 'push' | 'replace' = 'push'): void {
  const url = absolutePath(to)
  const current = `${window.location.pathname}${window.location.search}`
  if (url === current && !window.location.hash) {
    window.dispatchEvent(new Event(NAV_EVENT))
    return
  }
  if (mode === 'replace') history.replaceState(null, '', url)
  else history.pushState(null, '', url)
  window.dispatchEvent(new Event(NAV_EVENT))
  jumpTop()
}

function relativeHref(from: string, to: string): string {
  const fromDir = canonicalPath(from).split('/').filter(Boolean)
  const toParts = canonicalPath(to).split('/').filter(Boolean)
  let shared = 0
  while (shared < fromDir.length && shared < toParts.length && fromDir[shared] === toParts[shared]) shared += 1
  const parts = [...Array.from({ length: fromDir.length - shared }, () => '..'), ...toParts.slice(shared)]
  if (parts.length === 0) return './'
  return `${parts.join('/')}/`
}

function useRoute(initialPath?: string): Route {
  const [route, setRoute] = useState<Route>(() => (initialPath !== undefined ? parsePath(initialPath) : parseLocation()))
  const routeRef = useRef(route)
  routeRef.current = route
  useEffect(() => {
    const sync = () => {
      const next = parseLocation()
      if (routeKey(next) === routeKey(routeRef.current)) return
      const apply = () => {
        jumpTop()
        routeRef.current = next
        flushSync(() => setRoute(next))
      }
      if (motionAllowed() && typeof document.startViewTransition === 'function') {
        document.startViewTransition(apply)
        return
      }
      routeRef.current = next
      setRoute(next)
    }
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    window.addEventListener(NAV_EVENT, sync)
    const fromHash = legacyHash(window.location.hash)
    if (fromHash) navigate(fromHash, 'replace')
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
      window.removeEventListener(NAV_EVENT, sync)
    }
  }, [])
  return route
}

const RouteContext = createContext<Route>({ name: 'explore' })

export function RouteProvider({ initialPath, children }: { initialPath?: string; children: ReactNode }) {
  const route = useRoute(initialPath)
  return <RouteContext.Provider value={route}>{children}</RouteContext.Provider>
}

export function useCurrentRoute(): Route {
  return useContext(RouteContext)
}

export function RouteLink({
  to,
  className,
  children,
  ...rest
}: {
  to: string
  children: ReactNode
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  const from = routePath(useCurrentRoute())
  return (
    <a
      {...rest}
      href={relativeHref(from, to)}
      className={className}
      aria-current={rest['aria-current'] ?? (canonicalPath(to) === from ? 'page' : undefined)}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

export const PRERENDER_PATHS = [
  '/',
  '/explore/',
  '/overview/',
  '/work/',
  '/about/',
  '/resume/',
  '/map/',
  ...NODES.map((node) => `/${node.path}/`),
]
