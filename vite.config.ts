import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // App-shell offline support: the UI itself loads without a connection.
      // Notes still come from Supabase over the network, so a "You're offline" state
      // is expected while actually disconnected — this is not full offline data sync.
      manifest: {
        name: 'CRUD Notes',
        short_name: 'CRUD Notes',
        description: 'Learn CRUD, databases, and REST APIs — with a real notes app to prove it.',
        theme_color: '#14122a',
        background_color: '#14122a',
        display: 'standalone',
        start_url: '/dashboard',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
})
