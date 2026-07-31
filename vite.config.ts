import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Only `pnpm dev:web` (`vite --mode web`) gets these - `tauri dev` runs the
// same `pnpm dev` script Tauri's `beforeDevCommand` invokes, unaffected, so
// the real IPC bridge is never swapped out from under the desktop build.
const WEB_MOCK_ALIASES = {
  "@tauri-apps/api/core": path.resolve(__dirname, "./src/dev/tauriShims/core.ts"),
  "@tauri-apps/api/event": path.resolve(__dirname, "./src/dev/tauriShims/event.ts"),
  "@tauri-apps/api/window": path.resolve(__dirname, "./src/dev/tauriShims/window.ts"),
  "@tauri-apps/plugin-dialog": path.resolve(__dirname, "./src/dev/tauriShims/dialog.ts"),
  "@tauri-apps/plugin-fs": path.resolve(__dirname, "./src/dev/tauriShims/fs.ts"),
  "@tauri-apps/plugin-shell": path.resolve(__dirname, "./src/dev/tauriShims/shell.ts"),
  "@tauri-apps/plugin-process": path.resolve(__dirname, "./src/dev/tauriShims/process.ts"),
  "@tauri-apps/plugin-updater": path.resolve(__dirname, "./src/dev/tauriShims/updater.ts"),
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],

  // Prevent vite from obscuring rust errors
  clearScreen: false,

  // Tauri expects a fixed port, fail if that port is not available
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      // Ignore `src-tauri` and the Cargo build output.
      ignored: ["**/src-tauri/**", "**/target/**"],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...(mode === "web" ? WEB_MOCK_ALIASES : {}),
    },
  },

  // Env variables starting with TAURI_ are exposed to the frontend
  envPrefix: ["VITE_", "TAURI_"],

  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "es2020",
    // Produce source maps for debugging
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,

    // Fallback to original minifier until @tailwindcss/vite supports Vite 8
    cssMinify: "esbuild",
  },
}));
