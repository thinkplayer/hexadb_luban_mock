import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        math: "parens-division",
      },
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
