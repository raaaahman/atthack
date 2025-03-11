import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { vitePluginYarn } from "./dev/src/vitePlugin";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src/") },
  },
  plugins: [
    TanStackRouterVite(),
    react(),
    process.env.CI ? undefined : vitePluginYarn(),
  ],
});
