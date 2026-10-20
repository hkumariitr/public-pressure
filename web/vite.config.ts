import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev proxy: forward /api and the /live WebSocket to the backend so the web
// app talks to one origin in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
      '/live': { target: 'ws://localhost:4000', ws: true },
    },
  },
});
