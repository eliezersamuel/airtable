import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["src/setupTests.js"],
    globals: true,            // ← habilita expect/vi/it/desribe globais
  },
});
