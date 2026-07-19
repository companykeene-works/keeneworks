import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        home: resolve("index.html"),
        menu: resolve("menu.html")
      }
    }
  },
  plugins: [
    {
      name: "copy-classic-app-script",
      closeBundle() {
        copyFileSync(resolve("app.js"), resolve("dist/app.js"));
        copyFileSync(resolve("menu.js"), resolve("dist/menu.js"));
      }
    }
  ]
});
