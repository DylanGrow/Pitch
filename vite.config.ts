import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/pitch/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Pitch Perfect 26',
        short_name: 'PP26',
        description: 'Live FIFA World Cup 2026 scores, goal leaders, standings & schedules',
        theme_color: '#0a1628',
        background_color: '#0a1628',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/pitch_perfect_26/',
        start_url: '/pitch_perfect_26/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        categories: ['sports', 'news'],
        lang: 'en',
        dir: 'ltr'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.football-data\.org\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'football-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 120 },
              networkTimeoutSeconds: 10
            }
          }
        ],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/__/, /\/[^/?]+\.[^/]+$/]
      },
      devOptions: { enabled: true }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: { vendor: ['react', 'react-dom'] }
      }
    }
  },
  server: {
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data:; connect-src 'self' https://api.football-data.org; " +
        "font-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; " +
        "form-action 'self'; upgrade-insecure-requests",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
    }
  }
})
