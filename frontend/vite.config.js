import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: './', // Optional since it's already the frontend root
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
  }
});
