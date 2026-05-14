import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const API_TARGET = "https://smartcenter-deploy-latest.onrender.com";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/Enrollment": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/Section": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/ExamPaper": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/GradeExam": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/ConsultationRequest": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/WeatherForecast": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/User": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
