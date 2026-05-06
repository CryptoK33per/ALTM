import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  /* 🔒 Production Build Security */
  build: {

    // Prevents original source code from appearing in browser devtools
    sourcemap: false,

    // Minifies JS so code is unreadable
    minify: "esbuild",

    // Splits chunks so structure is hidden
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"]
        }
      }
    }

  }

})