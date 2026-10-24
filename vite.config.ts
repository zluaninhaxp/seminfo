import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import registrationStatus from './api/registration-status.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'registration-status',
    configureServer(server) {
      server.middlewares.use('/api/registration-status', (request, response) => {
        void registrationStatus(request, response);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/registration-status', (request, response) => {
        void registrationStatus(request, response);
      });
    },
  }],
})
