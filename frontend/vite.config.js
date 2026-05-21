import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const pagesBase = process.env.VITE_BASE_PATH || (repository ? `/${repository}/` : "/DevBurn-AI-Platform/");

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? pagesBase : "/",
});
