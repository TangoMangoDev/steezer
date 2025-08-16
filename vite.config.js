import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      '406940d0-dd78-4037-84de-1d6fdc84ec99-00-3ihksuq3pmws2.picard.replit.dev'
    ],
    hmr: {
      clientPort: 443
    },
    proxy: {
      '/data': {
        target: process.env.VITE_API_URL || 'https://stateezer.com/data',
        changeOrigin: true,
        secure: true
      },
      '/api': {
        target: process.env.VITE_API_URL || 'https://stateezer.com/stats',
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // 🔥 ADD THESE LINES TO FORCE CACHE BUSTING:
        entryFileNames: `[name].[hash].js`,
        chunkFileNames: `[name].[hash].js`, 
        assetFileNames: `[name].[hash].[ext]`,
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-vendor': ['zustand'],
          'utils-vendor': ['clsx', 'date-fns']
        }
      }
    }
  },
  // 🔥 ADD THIS SECTION TO HELP WITH CACHE ISSUES:
  optimizeDeps: {
    force: true
  }
});