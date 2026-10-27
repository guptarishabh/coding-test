import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server on :3000. Requests to /api are proxied to the Spring Boot backend
// on :8080, so no CORS configuration is needed in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
