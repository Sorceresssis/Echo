import { defineConfig } from "vite";
import type { BuildOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const build: BuildOptions = {
    minify: true,
    outDir: resolve(__dirname, "./dist/render"),
    rollupOptions: {
      input: {
        index: resolve(__dirname, './src/render/index.html'),
        itemDisplay: resolve(__dirname, './src/render/itemDisplay.html')
      }
    }
  };

  return {
    base: "./",
    // 修改vue渲染入口路径
    root: resolve(__dirname, "./src/render"),
    build,
    plugins: [vue()]
  }
});