import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource/fraunces/latin-500.css'
import '@fontsource/fraunces/latin-600.css'
import '@fontsource/fraunces/latin-700.css'
import '@fontsource/atkinson-hyperlegible/latin-400.css'
import '@fontsource/atkinson-hyperlegible/latin-700.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import './styles.css'
import { App } from './App.tsx'

const root = document.getElementById('root')
if (root) {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  )
  if (root.childElementCount > 0) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
