import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://baltz.dev",
  output: "static",
  build: {
    assets: "assets",
    inlineStylesheets: "always",
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 900,
      sourcemap: false,
    },
  },
});
