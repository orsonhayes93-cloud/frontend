import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',               // root is client/
  build: {
    outDir: 'dist/public', // <-- this ensures build stays inside client/
    emptyOutDir: true
  }
});
