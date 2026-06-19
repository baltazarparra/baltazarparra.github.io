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
        // Vite 8 usa Rolldown, que só aceita manualChunks como função.
        // three + fiber são eager (NoiseBackground). drei e postprocessing são
        // usados só pelo Hero3D (lazy): não recebem chunk nomeado aqui, então
        // o bundler os mantém no chunk lazy do Hero3D, fora do critical path.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          if (/[\\/]node_modules[\\/](three|@react-three[\\/]fiber)[\\/]/.test(id)) return 'three';
        },
        // Reduzindo tamanho dos nomes de arquivos
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
    },
    // Otimização de assets
    assetsInlineLimit: 4096,
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
