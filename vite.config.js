import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  // watch: {
  //   usePolling: true,
  //   interval: 100, // Poll every 100ms (adjust as needed)
  // },
  
});
