import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'og.jpg', 'smile.glb'],
      manifest: {
        name: 'Baltazar Parra',
        short_name: 'Baltz',
        description: 'Baltazar Parra - Tech Lead',
        theme_color: '#121212',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ],
  build: {
    // Otimização para build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Divisão do código
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'react-three': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
        },
      },
    },
    // Otimização de assets
    assetsInlineLimit: 4096,
    // Habilitar compressão Gzip e Brotli
    brotliSize: true,
  },
  // Otimizações para desenvolvimento
  server: {
    host: true,
    port: 3000,
    open: true,
  },
});
