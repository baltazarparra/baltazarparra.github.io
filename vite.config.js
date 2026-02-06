import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['robots.txt', 'og.jpg', 'smile.glb', 'icons/favicon.svg'],
      manifest: {
        name: 'Baltazar Parra',
        short_name: 'Baltz',
        description: 'Baltazar Parra - Tech Lead especialista em React, NextJS e otimização de performance',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: 'icons/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
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
        // Reduzindo tamanho dos nomes de arquivos
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
    // Otimização de assets
    assetsInlineLimit: 4096,
    // Habilitar compressão Gzip e Brotli
    brotliSize: true,
    // Melhor otimização de CSS
    cssCodeSplit: true,
    // Código mais limpo
    sourcemap: false
  },
  // Otimizações para desenvolvimento
  server: {
    host: true,
    port: 3000,
    open: true,
  },
});
