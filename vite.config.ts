import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Dev stays at the site root so nested routes can load /src. The build keeps relative
// asset paths, and the prerender step rewrites them for each directory.
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : './',
  plugins: [react()],
}))
