import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /**
   * 开发环境：浏览器访问的是 Vite 开发服务器（如 :5173），
   * 请求 `/api/*` 时由 Vite 转发到后端，避免浏览器直连不同端口产生跨域。
   */
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
});

