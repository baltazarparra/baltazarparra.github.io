import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://baltz.dev",
  output: "static",
  integrations: [react()],
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
