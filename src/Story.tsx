import { connectedNodes, findNode, nodeHref } from './data.ts'
import { Exhibit } from './exhibits.tsx'
import { RouteLink } from './route.tsx'

export function Story({ id }: { id: string }) {
  const node = findNode(id)

  if (!node) return null
  const related = connectedNodes(node.id)

  return (
    <article className="story document" id="story" aria-labelledby="story-title">
      <header className="story-head">
        <p className="kicker">Point {node.code} · {node.year}</p>
        <h1 id="story-title">{node.heading}</h1>
        <p className="role-line">{node.plate}</p>
        <p className="lede">{node.summary}</p>
        <p className="links-out">
          <RouteLink to="/work/">All work</RouteLink>
          <RouteLink to="/explore/">Walk the yard</RouteLink>
        </p>
      </header>
      <div className="story-grid">
        <div className="prose">
          {node.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {node.notes.length > 0 ? (
            <dl className="notes">
              {node.notes.map((note) => (
                <div key={note.label}>
                  <dt>{note.label}</dt>
                  <dd>{note.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {node.links.length > 0 ? (
            <ul className="links-out">
              {node.links.map((link) => (
                <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></li>
              ))}
            </ul>
          ) : null}
          {related.length > 0 ? (
            <nav className="related" aria-label="Connected points">
              <p>Connected</p>
              <ul>
                {related.map((item) => (
                  <li key={item.id}>
                    <RouteLink to={nodeHref(item.id)}>
                      <span>{item.code}</span> {item.heading}
                    </RouteLink>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        {node.exhibit ? <Exhibit id={node.exhibit} /> : <aside className="quiet-aside"><p>This point is a record, not a demo. The notes beside it are the whole of what I am willing to claim in public.</p></aside>}
      </div>
    </article>
  )
}
