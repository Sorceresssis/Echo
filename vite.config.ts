import { defineConfig } from "vite";
import type { BuildOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const build: BuildOptions = {
    outDir: resolve(__dirname, "./dist/render")
  };

  return {
    base: "./",
    // 修改vue渲染入口路径
    root: resolve(__dirname, "./src/render"),
    build,
    plugins: [vue()]
  }
});