import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define server-side only flag for conditional imports
    __SERVER_SIDE__: 'typeof window === "undefined"'
  },
  optimizeDeps: {
    exclude: ['nodemailer'] // Exclude nodemailer from client-side bundling
  },
  build: {
    rollupOptions: {
      external: ['nodemailer'] // External dependency, don't bundle
    }
  }
})
