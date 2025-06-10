import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        host: true,
        port: 8080,
        proxy: {
            "/api": {
                target: "http://192.168.0.20:8000", // your FastAPI backend
                changeOrigin: true,
                secure: false, // if not using HTTPS
                rewrite: (path) => path.replace(/^\/api/, ""), // <- this line is critical!
            },
        },
    },
});