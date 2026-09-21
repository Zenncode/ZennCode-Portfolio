import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('/react-router-dom/')) return 'react-router'
            if (id.includes('/react-dom/') || id.includes('/react/'))
              return 'react'
            if (id.includes('/firebase/')) return 'firebase'
            if (id.includes('/framer-motion/')) return 'motion'
            if (id.includes('/yjs/') || id.includes('/y-websocket/'))
              return 'yjs'
            return 'vendor'
          }
          return undefined
        },
      },
    },
  },
})
