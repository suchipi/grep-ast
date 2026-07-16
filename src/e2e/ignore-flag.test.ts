import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("--ignore excludes matching files", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/**/*.js",
    "--ignore",
    "./fixtures/nested/**",
  ]);
  await run.completion;
  const result = run.cleanResult();
  expect(result.code).toBe(1);
  expect(result.stderr).toContain(
    '["./fixtures/**/*.js","!./fixtures/nested/**"]'
  );
  expect(result.stderr).toContain("Found 7 files.");
  expect(result.stderr).toContain("3 total matches:");
  expect(result.stderr).toContain(
    "Failed to parse './fixtures/syntax-error.js'"
  );
  expect(result.stdout).toContain("./fixtures/simple.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:5:0-7:1");
  // nested/deep.js should be excluded by --ignore
  expect(result.stdout).not.toContain("nested/deep.js");
});
