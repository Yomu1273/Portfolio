import { useLayoutEffect, useRef, useState } from 'react'
import { EDGES, FACETS, NODES, nodeHref, type Facet, matchesQuery, nodeHaystack } from './data.ts'
import { RouteLink } from './route.tsx'

interface Line {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  hot: boolean
  quiet: boolean
}

interface Box {
  left: number
  top: number
  right: number
  bottom: number
}

/** Point where a line from this card's center toward another point crosses the card edge. */
function edgePoint(box: Box, towardX: number, towardY: number): { x: number; y: number } {
  const cx = (box.left + box.right) / 2
  const cy = (box.top + box.bottom) / 2
  const dx = towardX - cx
  const dy = towardY - cy
  const halfW = (box.right - box.left) / 2
  const halfH = (box.bottom - box.top) / 2
  if (dx === 0 && dy === 0) return { x: cx, y: cy }
  const scaleX = dx === 0 ? Number.POSITIVE_INFINITY : halfW / Math.abs(dx)
  const scaleY = dy === 0 ? Number.POSITIVE_INFINITY : halfH / Math.abs(dy)
  const scale = Math.min(scaleX, scaleY)
  return { x: cx + dx * scale, y: cy + dy * scale }
}

export function isQuiet(id: string, facet: Facet | 'all', query: string): boolean {
  const node = NODES.find((item) => item.id === id)
  if (!node) return true
  if (facet !== 'all' && node.facet !== facet) return true
  if (query.trim().length >= 2 && !matchesQuery(nodeHaystack(node), query)) return true
  return false
}

export function Atlas({
  facet,
  query,
  activeId,
  onFacet,
}: {
  facet: Facet | 'all'
  query: string
  activeId?: string
  onFacet: (facet: Facet | 'all') => void
}) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<Line[]>([])
  const quietKey = NODES.map((node) => (isQuiet(node.id, facet, query) ? node.id : '')).join('|')

  useLayoutEffect(() => {
    const board = boardRef.current
    if (!board) return
    const draw = () => {
      const bounds = board.getBoundingClientRect()
      const next: Line[] = []
      for (const edge of EDGES) {
        const from = board.querySelector<HTMLElement>(`[data-node="${edge.from}"]`)
        const to = board.querySelector<HTMLElement>(`[data-node="${edge.to}"]`)
        if (!from || !to) continue
        const a = from.getBoundingClientRect()
        const b = to.getBoundingClientRect()
        const fromBox = {
          left: a.left - bounds.left,
          top: a.top - bounds.top,
          right: a.right - bounds.left,
          bottom: a.bottom - bounds.top,
        }
        const toBox = {
          left: b.left - bounds.left,
          top: b.top - bounds.top,
          right: b.right - bounds.left,
          bottom: b.bottom - bounds.top,
        }
        const start = edgePoint(fromBox, (toBox.left + toBox.right) / 2, (toBox.top + toBox.bottom) / 2)
        const end = edgePoint(toBox, (fromBox.left + fromBox.right) / 2, (fromBox.top + fromBox.bottom) / 2)
        const hot = activeId === edge.from || activeId === edge.to
        const quiet = isQuiet(edge.from, facet, query) || isQuiet(edge.to, facet, query)
        next.push({
          id: `${edge.from}-${edge.to}`,
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          hot,
          quiet: quiet && !hot,
        })
      }
      setLines(next)
    }
    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(board)
    window.addEventListener('resize', draw)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', draw)
    }
  }, [activeId, facet, query, quietKey])

  return (
    <section className="atlas" id="map" aria-labelledby="map-title">
      <div className="deck">
        <div>
          <p className="kicker">Field notes · Chennai · 2020–2026</p>
          <h1 id="map-title">Choose any point.</h1>
          <p className="lede">
            Nine pieces of work, arranged by what grew out of what. The lines are relationships.
            Every point stays available, including the ones a lens dims.
          </p>
        </div>
        <dl className="identity">
          <div><dt>Trimble</dt><dd>Engineer II</dd></div>
          <div><dt>Study</dt><dd>SSN, 9.1</dd></div>
          <div><dt>Place</dt><dd>Chennai</dd></div>
        </dl>
      </div>

      <div className="lenses" role="group" aria-label="Emphasize a kind of work">
        <span>Emphasize</span>
        {FACETS.map((item) => (
          <button key={item.id} type="button" aria-pressed={facet === item.id} onClick={() => onFacet(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="board-frame">
        <div className="board" ref={boardRef}>
          <svg className="links" aria-hidden="true">
            {lines.map((line) => (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                data-hot={line.hot}
                data-quiet={line.quiet}
              />
            ))}
          </svg>
          {NODES.map((node) => {
            const quiet = isQuiet(node.id, facet, query)
            const current = activeId === node.id
            return (
              <RouteLink
                key={node.id}
                to={nodeHref(node.id)}
                className="plate"
                data-node={node.id}
                data-quiet={quiet}
                aria-current={current ? 'true' : undefined}
                style={{ ['--x' as string]: `${node.x}%`, ['--y' as string]: `${node.y}%` }}
              >
                <span className="plate-code">{node.code}</span>
                <span className="plate-year">{node.year}</span>
                <span className="plate-title">{node.heading}</span>
                <span className="plate-mark">{node.plate}</span>
              </RouteLink>
            )
          })}
        </div>
        <p className="board-note">Reference numbers match the index. Position is relationship, not rank or geography.</p>
      </div>
    </section>
  )
}
