import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    SERVER_URL: JSON.stringify("https://api.gautamkaran.cloud/api"),
    // SERVER_URL: JSON.stringify("http://localhost:3000/api"),
  },
  server: {
    port: 4173,
    host: true,
    allowedHosts: ["voisafe.gautamkaran.cloud", "api.gautamkaran.cloud"],
  },
});
