import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // until race condition is fixed in parallel-park
    maxWorkers: 1,
    testTimeout: 30_000,
  },
});
