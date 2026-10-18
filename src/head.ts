import { PROFILE, findNode } from './data.ts'
import { parsePath } from './route.tsx'

const HOME_TITLE = 'Yogesh Munees | Full-Stack Software Engineer — React, .NET & Applied AI'
const HOME_DESCRIPTION =
  'Yogesh Munees, Software Engineer II in Chennai. Full-stack engineer for enterprise React and .NET platforms, performance-sensitive APIs, and applied-AI workflows. Staging search to 17 ms, 10 workflows in two weeks, about 400 findings, 92% evaluated.'

export function pageMeta(pathname: string): { title: string; description: string } {
  const route = parsePath(pathname)
  if (route.name === 'work') {
    return {
      title: `Selected work | ${PROFILE.name}`,
      description: 'Case studies in platform architecture, PostgreSQL search, release engineering, applied AI, and open source.',
    }
  }
  if (route.name === 'about') {
    return {
      title: `About | ${PROFILE.name}`,
      description: 'Education, publication, certifications, leadership, and the work outside engineering, including Maaya Dhevadhaiye.',
    }
  }
  if (route.name === 'resume') {
    return {
      title: `Résumé | ${PROFILE.name}`,
      description: 'Software Engineer II at Trimble. Full-stack engineering, PostgreSQL performance, release ownership, and applied AI.',
    }
  }
  if (route.name === 'explore') {
    return { title: HOME_TITLE, description: HOME_DESCRIPTION }
  }
  if (route.name === 'overview') {
    return {
      title: `Overview | ${PROFILE.name}`,
      description: HOME_DESCRIPTION,
    }
  }
  if (route.name === 'map') {
    return {
      title: `Map | ${PROFILE.name}`,
      description: 'Nine pieces of work arranged by what grew out of what.',
    }
  }
  if (route.name === 'case') {
    const node = findNode(route.id)
    if (node) {
      return {
        title: `${node.heading} | ${PROFILE.name}`,
        description: node.summary,
      }
    }
  }
  return { title: HOME_TITLE, description: HOME_DESCRIPTION }
}

export function headMarkup(pathname: string, origin = ''): string {
  const meta = pageMeta(pathname)
  const root = origin.replace(/\/$/, '')
  const canonical = root ? `${root}${pathname.startsWith('/') ? pathname : `/${pathname}`}` : ''
  const image = root ? `${root}/og.png` : ''
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}" />` : '',
    canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}" />` : '',
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : '',
    image ? `<meta property="og:image:width" content="1200" />` : '',
    image ? `<meta property="og:image:height" content="630" />` : '',
  ].filter(Boolean).join('\n    ')
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
