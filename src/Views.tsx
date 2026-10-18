import {
  BEYOND,
  CERTIFICATIONS,
  EDUCATION,
  EXPERIENCE,
  LEADERSHIP,
  NODES,
  OFFER,
  PROFILE,
  PUBLICATION,
  SELECTED_WORK,
  SKILL_GROUPS,
  SONG,
  findNode,
  nodeHref,
} from './data.ts'
import { RouteLink } from './route.tsx'

function ContactLinks() {
  return (
    <ul className="links-out">
      <li><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></li>
      <li><a href={PROFILE.linkedin}>LinkedIn</a></li>
      <li><a href={PROFILE.github}>GitHub</a></li>
    </ul>
  )
}

export function SiteNav() {
  return (
    <header className="site-header">
      <RouteLink to="/" className="brand"><span>Ym</span> {PROFILE.name}</RouteLink>
      <nav className="site-nav" aria-label="Primary">
        <RouteLink to="/overview/">Overview</RouteLink>
        <RouteLink to="/work/">Work</RouteLink>
        <RouteLink to="/about/">About</RouteLink>
        <RouteLink to="/resume/">Résumé</RouteLink>
        <RouteLink to="/">Explore</RouteLink>
      </nav>
    </header>
  )
}

export function Home() {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: PROFILE.name,
      jobTitle: PROFILE.role,
      description: PROFILE.positioning,
      email: `mailto:${PROFILE.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
      worksFor: { '@type': 'Organization', name: PROFILE.org },
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'SSN College of Engineering' },
        { '@type': 'EducationalOrganization', name: 'SKV Vidhyashram' },
      ],
      knowsAbout: ['React', 'TypeScript', '.NET', 'C#', 'PostgreSQL', 'Python', 'REST APIs', 'applied AI', 'system design'],
      sameAs: [PROFILE.linkedin, PROFILE.github, PUBLICATION.href, SONG.href].filter((item) => Boolean(item)),
    },
  }
  return (
    <article className="document" id="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <p className="kicker">{PROFILE.place}</p>
      <h1>{PROFILE.name}</h1>
      <p className="role-line">{PROFILE.role}, {PROFILE.org}</p>
      <p className="lede">{PROFILE.positioning}</p>
      <ContactLinks />
      <h2>Proof</h2>
      <ul className="metrics">
        {OFFER.figures.map((figure) => (
          <li key={figure.node}>
            <RouteLink to={nodeHref(figure.node)}>
              <strong>{figure.value}</strong>
              <span>{figure.label}</span>
            </RouteLink>
          </li>
        ))}
      </ul>
      <h2>What I take responsibility for</h2>
      <ul className="record">
        {OFFER.signals.map((signal) => (
          <li key={signal.area}>
            <strong>{signal.area}</strong>
            <span>{signal.line}</span>
            <RouteLink to={nodeHref(signal.node)}>Read the work</RouteLink>
          </li>
        ))}
      </ul>
      <h2>Selected work</h2>
      <ol className="work-list">
        {SELECTED_WORK.map((id) => {
          const node = findNode(id)
          if (!node) return null
          return (
            <li key={node.id}>
              <RouteLink to={nodeHref(node.id)}>
                <strong>{node.heading}</strong>
                <small>{node.plate} · {node.year}</small>
                <span>{node.summary}</span>
              </RouteLink>
            </li>
          )
        })}
      </ol>
      <p><RouteLink to="/work/">All nine pieces of work</RouteLink></p>
      <h2>Experience</h2>
      <ul className="record">
        {EXPERIENCE.map((role) => (
          <li key={role.dates}>
            <strong>{role.title}, {role.org}</strong>
            <span>{role.dates} · {role.place}</span>
          </li>
        ))}
      </ul>
      <p><RouteLink to="/resume/">Full résumé</RouteLink></p>
      <h2>The words a search would use</h2>
      <p className="toolkit">{OFFER.toolkit}</p>
      <p>{OFFER.caveat}</p>
      <h2>Or walk it</h2>
      <p>The site opens on that yard. These pages are the written record.</p>
      <p><RouteLink to="/">Explore the yard</RouteLink></p>
    </article>
  )
}

export function WorkIndex() {
  return (
    <article className="document" id="work">
      <p className="kicker">Work</p>
      <h1>Nine pieces, with the professional name first.</h1>
      <p className="lede">Each title is the kind of work. The line under it is the name I use on the yard. Open any of them for the write-up and, where I can show one, a working model.</p>
      <ol className="work-list">
        {NODES.map((node) => (
          <li key={node.id}>
            <RouteLink to={nodeHref(node.id)}>
              <span className="work-code">{node.code}</span>
              <strong>{node.heading}</strong>
              <small>{node.plate} · {node.year} · {node.mark}</small>
              <span>{node.summary}</span>
            </RouteLink>
          </li>
        ))}
      </ol>
      <p><RouteLink to="/map/">See how the work connects</RouteLink></p>
    </article>
  )
}

export function About() {
  return (
    <article className="document" id="about">
      <p className="kicker">About</p>
      <h1>Record, credentials, and the rest of the range.</h1>
      <p className="lede">{PROFILE.summary}</p>
      <h2>Education</h2>
      <ul className="record">
        {EDUCATION.map((item) => (
          <li key={item.id}><strong>{item.label}</strong><span>{item.detail}</span></li>
        ))}
      </ul>
      <h2>Publication</h2>
      <ul className="record">
        <li>
          <strong>{PUBLICATION.label}</strong>
          <span>{PUBLICATION.detail}</span>
          {PUBLICATION.href ? <a href={PUBLICATION.href}>Read the paper</a> : null}
        </li>
      </ul>
      <h2>Certifications</h2>
      <ul className="record">
        {CERTIFICATIONS.map((item) => (
          <li key={item.id}>
            <strong>{item.label}</strong>
            <span>{item.detail}</span>
            {item.href ? <a href={item.href}>View credential</a> : null}
          </li>
        ))}
      </ul>
      <h2>Leadership and recognition</h2>
      <ul className="plain-list">
        {LEADERSHIP.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <h2>Beyond engineering</h2>
      <p>
        <a href={SONG.href}>{SONG.title}</a> is a released single. I am a credited artist: {SONG.credit}
      </p>
      <ul className="record">
        {BEYOND.map((item) => (
          <li key={item.label}><strong>{item.label}</strong><span>{item.value}</span></li>
        ))}
      </ul>
      <ContactLinks />
    </article>
  )
}

export function Resume() {
  const openSource = findNode('published')
  return (
    <article className="document" id="resume">
      <p className="kicker">Résumé · {PROFILE.place}</p>
      <h1>{PROFILE.name}</h1>
      <p className="role-line">{PROFILE.role} · Full-stack engineering · AI-enabled applications</p>
      <p className="lede">{PROFILE.positioning}</p>
      <ContactLinks />
      <h2>Experience</h2>
      {EXPERIENCE.map((role) => (
        <section key={role.dates} className="role">
          <header className="role-head">
            <h3>{role.title}, {role.org}</h3>
            <p>{role.dates} · {role.place}</p>
          </header>
          <ul>
            {role.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </section>
      ))}
      {openSource ? (
        <>
          <h2>Open source</h2>
          <section className="role">
            <header className="role-head">
              <h3>{openSource.heading}</h3>
              <p>{openSource.year}</p>
            </header>
            <ul>
              {openSource.paragraphs.slice(0, 2).map((point) => <li key={point}>{point}</li>)}
            </ul>
            <p className="links-out">
              {openSource.links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
            </p>
          </section>
        </>
      ) : null}
      <h2>Technical skills</h2>
      <ul className="record">
        {SKILL_GROUPS.map((group) => (
          <li key={group.label}><strong>{group.label}</strong><span>{group.value}</span></li>
        ))}
      </ul>
      <h2>Education</h2>
      <ul className="record">
        {EDUCATION.map((item) => (
          <li key={item.id}><strong>{item.label}</strong><span>{item.detail}</span></li>
        ))}
      </ul>
      <h2>Publication</h2>
      <p><a href={PUBLICATION.href}>{PUBLICATION.label}</a>. {PUBLICATION.detail}</p>
      <h2>Certifications</h2>
      <ul className="record">
        {CERTIFICATIONS.map((item) => (
          <li key={item.id}>
            <strong>{item.label}</strong>
            <span>{item.detail}</span>
            {item.href ? <a href={item.href}>View credential</a> : null}
          </li>
        ))}
      </ul>
      <h2>Leadership and recognition</h2>
      <ul className="plain-list">
        {LEADERSHIP.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <h2>Beyond engineering</h2>
      <p><a href={SONG.href}>{SONG.title}</a>. {SONG.credit} {BEYOND.map((item) => item.value).join(' ')}</p>
    </article>
  )
}
