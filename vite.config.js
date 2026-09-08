import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// bind to 0.0.0.0 so the platform preview can reach it, and allow any host/origin
export default defineConfig({
  plugins: [react()],
  // Relative base so the build works both on the Arena preview (root)
  // and on GitHub Pages subpath (e.g. /Gemini-controlling-your-mobile-screen-/).
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: true,
    hmr: { host: '0.0.0.0' }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: true
  }
})
