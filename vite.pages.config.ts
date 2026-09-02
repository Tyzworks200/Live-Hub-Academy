import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: "github-pages",
  base: "/Live-Hub-Academy/",
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
});
