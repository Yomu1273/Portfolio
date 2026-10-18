import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { EDGES, NODES, PROFILE, nodeHref } from './data.ts'
import { RouteLink, navigate } from './route.tsx'

const WORLD_W = 2600
const WORLD_H = 1680
const SPEED = 520
const NEAR = 118

const PLACES: Record<string, { x: number; y: number; place: string; kind: string }> = {
  led: { x: 1300, y: 240, place: 'Union', kind: 'union' },
  signed: { x: 420, y: 480, place: 'Studio', kind: 'studio' },
  accelerated: { x: 2180, y: 460, place: 'Bench', kind: 'bench' },
  imagined: { x: 320, y: 980, place: 'Yard', kind: 'yard' },
  shipped: { x: 720, y: 1320, place: 'Floor', kind: 'floor' },
  hardened: { x: 2280, y: 1080, place: 'Gate', kind: 'gate' },
  measured: { x: 560, y: 1540, place: 'Hall', kind: 'hall' },
  automated: { x: 1300, y: 1560, place: 'Radio', kind: 'radio' },
  published: { x: 2040, y: 1500, place: 'Press', kind: 'press' },
}

const SPAWN = { x: 1300, y: 1000 }
const LOOK_AHEAD = 180
const MONUMENT = { x: 1300, y: SPAWN.y - LOOK_AHEAD }

interface Stick {
  x: number
  y: number
  on: boolean
}

interface Point {
  x: number
  y: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const startPoint = (): Point => ({ ...SPAWN })

const startCamera = (): Point => {
  const point = startPoint()
  return { x: point.x, y: point.y - LOOK_AHEAD }
}

const seenKey = 'ym-grounds-seen'

const readSeen = (): Set<string> => {
  try {
    return new Set((sessionStorage.getItem(seenKey) ?? '').split(',').filter(Boolean))
  } catch {
    return new Set()
  }
}

const remember = (id: string) => {
  const seen = readSeen()
  seen.add(id)
  try {
    sessionStorage.setItem(seenKey, [...seen].join(','))
  } catch {
    /* private mode can refuse storage; the visit still counts on screen */
  }
  return seen
}

function WorldLive() {
  const stageRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const walkerRef = useRef<HTMLDivElement>(null)
  const lampRef = useRef<HTMLDivElement>(null)
  const farRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const posRef = useRef<Point>(startPoint())
  const velRef = useRef<Point>({ x: 0, y: 0 })
  const camRef = useRef<Point>(startCamera())
  const scaleRef = useRef(1)
  const destRef = useRef<Point | null>(null)
  const stickRef = useRef<Stick>({ x: 0, y: 0, on: false })
  const keysRef = useRef<Set<string>>(new Set())
  const pausedRef = useRef(false)
  const scriptedRef = useRef(false)
  const nearRef = useRef<string | null>(null)
  const reduceRef = useRef(false)
  const [near, setNear] = useState<string | null>(null)
  const [seen, setSeen] = useState<Set<string>>(() => new Set())
  const [pocket, setPocket] = useState(false)
  const pocketRef = useRef(false)
  pocketRef.current = pocket

  useLayoutEffect(() => {
    const stage = stageRef.current
    const world = worldRef.current
    const walker = walkerRef.current
    if (!stage || !world || !walker) return
    const view = stage.getBoundingClientRect()
    const pos = posRef.current
    const cam = camRef.current
    const scale = 1
    const shiftX = view.width / 2 - cam.x * scale
    const shiftY = view.height / 2 - cam.y * scale
    world.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) scale(${scale})`
    if (farRef.current) farRef.current.style.transform = `translate3d(${shiftX * 0.22}px, ${shiftY * 0.22}px, 0)`
    if (lampRef.current) lampRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
    walker.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
  }, [])

  useEffect(() => {
    setSeen(readSeen())
    reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const pos = posRef.current
      const vel = velRef.current
      let ix = 0
      let iy = 0
      const keys = keysRef.current
      const typing = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement
      if (pocketRef.current) {
        ix = 0
        iy = 0
        destRef.current = null
        scriptedRef.current = false
      } else if (!pausedRef.current && !typing) {
        if (keys.has('arrowleft') || keys.has('a')) ix -= 1
        if (keys.has('arrowright') || keys.has('d')) ix += 1
        if (keys.has('arrowup') || keys.has('w')) iy -= 1
        if (keys.has('arrowdown') || keys.has('s')) iy += 1
      }
      const stick = stickRef.current
      if ((ix !== 0 || iy !== 0) && !pausedRef.current) {
        destRef.current = null
        scriptedRef.current = false
        const length = Math.hypot(ix, iy) || 1
        ix /= length
        iy /= length
      } else if (stick.on && !pausedRef.current && !pocketRef.current) {
        destRef.current = null
        scriptedRef.current = false
        ix = stick.x
        iy = stick.y
      } else if (destRef.current && (!pausedRef.current || scriptedRef.current)) {
        const dx = destRef.current.x - pos.x
        const dy = destRef.current.y - pos.y
        const distance = Math.hypot(dx, dy)
        if (distance < 8) {
          destRef.current = null
          scriptedRef.current = false
        } else {
          ix = dx / distance
          iy = dy / distance
        }
      }

      if (reduceRef.current && destRef.current) {
        pos.x = destRef.current.x
        pos.y = destRef.current.y
        destRef.current = null
        scriptedRef.current = false
        vel.x = 0
        vel.y = 0
      } else {
        const ease = 1 - Math.exp(-14 * dt)
        vel.x += (ix * SPEED - vel.x) * ease
        vel.y += (iy * SPEED - vel.y) * ease
        pos.x = clamp(pos.x + vel.x * dt, 70, WORLD_W - 70)
        pos.y = clamp(pos.y + vel.y * dt, 70, WORLD_H - 70)
      }

      const stage = stageRef.current
      const world = worldRef.current
      const walker = walkerRef.current
      if (stage && world && walker) {
        const view = stage.getBoundingClientRect()
        const wanted = 1
        const zoom = reduceRef.current ? 1 : 1 - Math.exp(-3.2 * dt)
        scaleRef.current += (wanted - scaleRef.current) * zoom
        const scale = scaleRef.current
        const bias = pausedRef.current && view.width >= 900 ? Math.min(280, view.width * 0.2) : 0
        const follow = reduceRef.current ? 1 : 1 - Math.exp(-6 * dt)
        camRef.current.x += (pos.x + bias - camRef.current.x) * follow
        camRef.current.y += (pos.y - LOOK_AHEAD - camRef.current.y) * follow
        const shiftX = view.width / 2 - camRef.current.x * scale
        const shiftY = view.height / 2 - camRef.current.y * scale
        world.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) scale(${scale})`
        if (farRef.current) farRef.current.style.transform = `translate3d(${shiftX * 0.22}px, ${shiftY * 0.22}px, 0)`
        if (lampRef.current) lampRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
        if (nameRef.current) {
          const away = Math.hypot(pos.x - SPAWN.x, pos.y - SPAWN.y)
          const fade = pausedRef.current ? 0 : Math.max(0, Math.min(1, 1 - (away - 30) / 340))
          nameRef.current.style.opacity = String(fade)
        }
        const moving = Math.hypot(vel.x, vel.y) > 18
        if (moving) {
          walker.dataset.facing = String(Math.atan2(vel.x, -vel.y))
          walker.dataset.moving = 'true'
        } else {
          walker.dataset.moving = 'false'
        }
        walker.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${Number(walker.dataset.facing ?? 0)}rad)`
        walker.style.zIndex = String(Math.round(pos.y))
      }
      if (dotRef.current) {
        dotRef.current.setAttribute('cx', String((pos.x / WORLD_W) * 100))
        dotRef.current.setAttribute('cy', String((pos.y / WORLD_H) * 64.6))
      }

      let closest: string | null = null
      let best = NEAR
      for (const node of NODES) {
        const place = PLACES[node.id]
        if (!place) continue
        const distance = Math.hypot(place.x - pos.x, place.y - pos.y)
        if (distance < best) {
          best = distance
          closest = node.id
        }
      }
      if (closest !== nearRef.current) {
        nearRef.current = closest
        setNear(closest)
        if (closest) setSeen(remember(closest))
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // The loop reads live refs. Restarting it would teleport the walker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement
      if (typing) return
      const key = event.key.toLowerCase()
      if (pocketRef.current) {
        if (key === 'escape') setPocket(false)
        return
      }
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's'].includes(key)) {
        if (!pausedRef.current) event.preventDefault()
        keysRef.current.add(key)
      }
      if (key === 'e' && nearRef.current && !pausedRef.current) {
        event.preventDefault()
        navigate(nodeHref(nearRef.current))
      }
      if (key === 'escape') {
        if (pocketRef.current) setPocket(false)
        else if (pausedRef.current) navigate('/explore/')
      }
    }
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase())
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const walkTo = (point: Point, scripted = false) => {
    destRef.current = point
    scriptedRef.current = scripted
  }

  const onStagePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element) || event.target.closest('.station')) return
    const world = worldRef.current
    if (!world) return
    const rect = world.getBoundingClientRect()
    const sx = rect.width / WORLD_W || 1
    const sy = rect.height / WORLD_H || 1
    const point = {
      x: clamp((event.clientX - rect.left) / sx, 70, WORLD_W - 70),
      y: clamp((event.clientY - rect.top) / sy, 70, WORLD_H - 70),
    }
    if (pausedRef.current) navigate('/explore/')
    walkTo(point)
  }

  const nearNode = NODES.find((node) => node.id === near)

  return (
    <div className="world-page">
      <div className="world-stage" ref={stageRef} onPointerDown={onStagePointer}>
        <div className="far-layer" ref={farRef} aria-hidden="true" />
        <div className="world" ref={worldRef}>
          <div className="ground-mark" style={{ left: MONUMENT.x, top: MONUMENT.y }} aria-hidden="true" />
          <svg className="ground-links" viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} aria-hidden="true">
            {EDGES.map((edge) => {
              const from = PLACES[edge.from]
              const to = PLACES[edge.to]
              if (!from || !to) return null
              return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
            })}
          </svg>
          {NODES.map((node) => {
            const place = PLACES[node.id]
            if (!place) return null
            return (
              <button
                key={node.id}
                type="button"
                className="station"
                data-kind={place.kind}
                data-near={near === node.id}
                data-seen={seen.has(node.id)}
                style={{ left: place.x, top: place.y, zIndex: place.y }}
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(nodeHref(node.id))
                }}
              >
                <span className="station-card">
                  <span>{place.place} · {node.year}</span>
                  <strong>{node.heading}</strong>
                  <em>{node.plate}</em>
                </span>
                <span className="station-pin" aria-hidden="true" />
              </button>
            )
          })}
          <div className="lamp" ref={lampRef} style={{ transform: `translate3d(${SPAWN.x}px, ${SPAWN.y}px, 0)` }} aria-hidden="true" />
          <div className="walker" ref={walkerRef} style={{ transform: `translate3d(${SPAWN.x}px, ${SPAWN.y}px, 0)` }} aria-hidden="true">
            <span className="walker-shadow" />
            <span className="walker-body" />
          </div>
        </div>
        <svg
          className="minimap"
          viewBox="0 0 100 64.6"
          role="img"
          aria-label="Grounds overview. Click to walk there."
          onPointerDown={(event) => {
            event.stopPropagation()
            const rect = event.currentTarget.getBoundingClientRect()
            walkTo({
              x: clamp(((event.clientX - rect.left) / rect.width) * WORLD_W, 70, WORLD_W - 70),
              y: clamp(((event.clientY - rect.top) / rect.height) * WORLD_H, 70, WORLD_H - 70),
            })
            if (pausedRef.current) navigate('/explore/')
          }}
        >
          {NODES.map((node) => {
            const place = PLACES[node.id]
            if (!place) return null
            return <circle key={node.id} cx={(place.x / WORLD_W) * 100} cy={(place.y / WORLD_H) * 64.6} r={1.5} />
          })}
          <circle ref={dotRef} className="minimap-you" cx="50" cy="40" r="2.2" />
        </svg>
        <nav className="yard-nav" aria-label="Primary" onPointerDown={(event) => event.stopPropagation()}>
          <RouteLink to="/overview/">Overview</RouteLink>
          <RouteLink to="/work/">Work</RouteLink>
          <RouteLink to="/resume/">Résumé</RouteLink>
        </nav>
        <div className="yard-name" ref={nameRef}>
          <p>{PROFILE.role}, {PROFILE.org}</p>
          <h1>Yogesh Munees</h1>
          <RouteLink
            to="/overview/"
            className="glance-open"
            onPointerDown={(event) => event.stopPropagation()}
          >
            Quick glance
          </RouteLink>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{nearNode ? `Near ${nearNode.plate}. Press E or Look.` : 'In the yard.'}</p>

      <button
        type="button"
        className="pocket-toggle"
        aria-expanded={pocket}
        aria-controls="pocket"
        aria-label="Open menu"
        onClick={() => setPocket((open) => !open)}
      >
        Ym
      </button>
      {pocket ? (
        <div className="pocket" id="pocket" role="dialog" aria-label="Pocket">
          <header>
            <p>Yogesh Munees</p>
            <button type="button" onClick={() => setPocket(false)}>Close</button>
          </header>
          <nav>
            <RouteLink to="/overview/">Overview</RouteLink>
            <RouteLink to="/work/">Work</RouteLink>
            <RouteLink to="/about/">About</RouteLink>
            <RouteLink to="/resume/">Résumé</RouteLink>
          </nav>
          <ul>
            {NODES.map((node) => {
              const place = PLACES[node.id]
              return (
                <li key={node.id}>
                  <RouteLink to={nodeHref(node.id)}>
                    <span>{place?.place}</span>
                    <strong>{node.heading}</strong>
                  </RouteLink>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      <Joystick stickRef={stickRef} />

      {nearNode ? (
        <RouteLink to={nodeHref(nearNode.id)} className="look-btn">
          Read · {nearNode.heading}
        </RouteLink>
      ) : null}
    </div>
  )
}

function Joystick({ stickRef }: { stickRef: { current: Stick } }) {
  const padRef = useRef<HTMLDivElement>(null)
  const nubRef = useRef<HTMLDivElement>(null)

  const place = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pad = padRef.current
    const nub = nubRef.current
    if (!pad || !nub) return
    const rect = pad.getBoundingClientRect()
    const max = rect.width * 0.32
    let dx = event.clientX - (rect.left + rect.width / 2)
    let dy = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(dx, dy) || 1
    const limited = Math.min(distance, max)
    dx = (dx / distance) * limited
    dy = (dy / distance) * limited
    stickRef.current = { x: dx / max, y: dy / max, on: true }
    nub.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const release = () => {
    stickRef.current = { x: 0, y: 0, on: false }
    if (nubRef.current) nubRef.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      className="stick"
      ref={padRef}
      aria-hidden="true"
      onPointerDown={(event) => {
        event.stopPropagation()
        event.currentTarget.setPointerCapture(event.pointerId)
        place(event)
      }}
      onPointerMove={(event) => {
        if (stickRef.current.on) place(event)
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div className="stick-nub" ref={nubRef} />
    </div>
  )
}

export function World() {
  return <WorldLive />
}
