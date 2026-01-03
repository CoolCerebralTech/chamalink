import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        contribution: resolve(__dirname, 'contribution.html'),
      },
    },
  },
  server: {
    port: 5173, // Default Vite port
  }
});