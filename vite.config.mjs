import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const copySourceAssets = () => ({
  name: 'copy-source-assets',
  closeBundle() {
    const source = resolve('src/assets');
    const target = resolve('dist/assets');

    if (existsSync(source)) {
      cpSync(source, target, { recursive: true });
    }
  },
});

export default defineConfig({
  optimizeDeps: {
    noDiscovery: true,
    include: ['cookie', 'react-dom/client', 'set-cookie-parser'],
  },
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
    copySourceAssets(),
  ],
  base: '/2026/',
});
