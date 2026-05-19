import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'redirect-root-to-base',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '/2026') {
            res.statusCode = 302;
            res.setHeader('Location', '/2026/');
            res.end();
            return;
          }

          next();
        });
      },
    },
  ],
  base: '/2026/',
});
