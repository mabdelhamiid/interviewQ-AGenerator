// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/groq':       { target: 'https://api.groq.com',         changeOrigin: true, rewrite: p => p.replace(/^\/groq/, '')       },
      '/openrouter': { target: 'https://openrouter.ai',        changeOrigin: true, rewrite: p => p.replace(/^\/openrouter/, '') },
      '/mistral':    { target: 'https://api.mistral.ai',       changeOrigin: true, rewrite: p => p.replace(/^\/mistral/, '')    },
      '/cohere':     { target: 'https://api.cohere.ai',        changeOrigin: true, rewrite: p => p.replace(/^\/cohere/, '')     },
      '/anthropic':  { target: 'https://api.anthropic.com',    changeOrigin: true, rewrite: p => p.replace(/^\/anthropic/, '')  },
      '/openai':     { target: 'https://api.openai.com',       changeOrigin: true, rewrite: p => p.replace(/^\/openai/, '')     },
    },
  },
})
