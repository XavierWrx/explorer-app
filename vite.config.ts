// vite.config.ts — Configuración de Vite y Tailwind CSS v4

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});