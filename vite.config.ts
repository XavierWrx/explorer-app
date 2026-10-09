import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/api-proxy": {
        target: "https://api.restcountries.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        busqueda: resolve(__dirname, "Busqueda.html"),
        respuesta: resolve(__dirname, "Respuesta.html"),
      },
    },
  },
});