import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [
    react()
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
