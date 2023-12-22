import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import postCssPxToRem from "postcss-pxtorem";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        math: "parens-division",
      },
    },
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 37.5, // 1rem的大小
          propList: ["*"], // 需要转换的属性，这里选择全部都进行转换
        }),
      ],
    },
  },
  server: {
    watch: {
      usePolling: true, // 修复HMR热更新失效
    },
  },
  resolve: {
    alias: {
      // 关键代码
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
