import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  optimizeDeps: {
    include: ['recharts'], // ✅ fix dependency pre-bundling
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // ✅ fix CJS/ESM conflict
    },
  },
})