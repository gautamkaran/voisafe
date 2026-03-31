import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    SERVER_URL: JSON.stringify("https://api.gautamkaran.cloud/api"),
  },
  server: {
    port: 4173,
    host: true,
    allowedHosts: ["voisafe.gautamkaran.cloud", "api.gautamkaran.cloud"],
  },
});
