import { defineConfig } from "vite";
import type { BuildOptions } from "vite";
import vue from "@vitejs/plugin-vue";
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import topLevelAwait from 'vite-plugin-top-level-await'
import { resolve } from "path";

export default defineConfig(() => {
  const build: BuildOptions = {
    minify: true,
    outDir: resolve(__dirname, "./dist/render"),
    rollupOptions: {
      input: {
        index: resolve(__dirname, './src/render/index.html'),
        itemDisplay: resolve(__dirname, './src/render/record/index.html')
      }
    }
  };

  return {
    base: "./",
    // vue渲染入口路径
    root: resolve(__dirname, "./src/render"),
    resolve: {
      alias: {
        "@": "",
      },
    },
    build,
    plugins: [vue(),
    vueI18n({
      include: resolve(__dirname, './src/render/locales/**')
    }),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: i => `__tla_${i}`
    })],
  }
});