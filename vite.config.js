import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Importante para Docker
    port: 3100,      // Puerto de desarrollo
    strictPort: true, // No cambiar el puerto automáticamente
  },
  preview: {
    port: 3100,      // Puerto para npm run preview (producción)
  },
  build: {
    outDir: 'dist',  // Carpeta donde se genera el build
  },
});