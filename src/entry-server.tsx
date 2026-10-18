import { renderToString } from 'react-dom/server'
import { App } from './App.tsx'
import { headMarkup } from './head.ts'

export function render(url: string, origin = ''): { html: string; head: string } {
  return {
    html: renderToString(<App initialPath={url} />),
    head: headMarkup(url, origin),
  }
}
