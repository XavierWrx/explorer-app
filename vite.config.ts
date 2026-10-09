import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/api/countries": {
          target: "https://api.restcountries.com",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api\/countries/, "/countries/v5"),
          headers: env.REST_COUNTRIES_API_KEY
            ? { Authorization: `Bearer ${env.REST_COUNTRIES_API_KEY}` }
            : {},
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
  };
});