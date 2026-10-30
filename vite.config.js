
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['calendar.svg'],
      manifest: {
        name: 'DayFlow Daily Planner',
        short_name: 'DayFlow',
        description: 'Plan your days and accomplish more.',
        theme_color: '#7256d9',
        background_color: '#f8f7fc',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/calendar.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        navigateFallback: 'index.html'
      }
    })
  ]
})
