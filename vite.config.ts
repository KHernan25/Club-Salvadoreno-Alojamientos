import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("🔴 Proxy error:", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log(
              "📤 Proxying request:",
              req.method,
              req.url,
              "→",
              (options.target || "") + (req.url || ""),
            );
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("📥 Proxy response:", proxyRes.statusCode, req.url);
          });
        },
      },
      "/health": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
