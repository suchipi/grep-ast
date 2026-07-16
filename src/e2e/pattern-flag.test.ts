import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("default pattern searches expected paths", async () => {
  const run = spawn("node", [
    cliPath,
    "--ignore",
    "./src/e2e/**",
    "--ignore",
    "./vitest.config.ts",
    "Identifier[name=slice]",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "- Matching patterns: ["./**/*.{c,m,}{j,t}s{,x}","!./src/e2e/**","!./vitest.config.ts"] (gitignore: enabled)
    ✔ Found 17 files.
    - Parsing files...
    ✔ Parsed files.

    Results:
    Failed to parse 'fixtures/syntax-error.js': Unexpected keyword 'return'. (2:2)
    src/readArgv.ts:13:40-13:45
      11 |   }
      12 |
    > 13 |   const result = parseArgv(process.argv.slice(2), {
         |                                         ^^^^^
      14 |     selector: String,
      15 |     pattern: arrayOfStrings,
      16 |     ignore: arrayOfStrings,


    1 total matches:
    ",
      "stdout": "src/readArgv.ts:13:40-13:45
    ",
    }
  `);
});

test("--pattern with glob pattern", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/*.js",
  ]);
  await run.completion;
  const result = run.cleanResult();
  // exit code 1 because syntax-error.js causes a parse error
  expect(result.code).toBe(1);
  expect(result.stderr).toContain("Found 7 files.");
  expect(result.stderr).toContain("3 total matches:");
  expect(result.stderr).toContain(
    "Failed to parse './fixtures/syntax-error.js'"
  );
  expect(result.stderr).toContain("./fixtures/simple.js:");
  expect(result.stderr).toContain("./fixtures/two-functions.js:");
  expect(result.stdout).toContain("./fixtures/simple.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:5:0-7:1");
});

test("patterns with no matching files", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/nonexistent-*.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/nonexistent-*.js"] (gitignore: enabled)
      ✔ Found 0 files.
      - Parsing files...
      ✔ Parsed files.

      Results:

      0 total matches:
      ",
        "stdout": "",
      }
    `);
});

test("--pattern with recursive glob includes nested files", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/**/*.js",
  ]);
  await run.completion;
  const result = run.cleanResult();
  expect(result.code).toBe(1);
  expect(result.stderr).toContain("Found 8 files.");
  expect(result.stderr).toContain("4 total matches:");
  expect(result.stderr).toContain(
    "Failed to parse './fixtures/syntax-error.js'"
  );
  expect(result.stdout).toContain("./fixtures/simple.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:5:0-7:1");
  expect(result.stdout).toContain("./fixtures/nested/deep.js:1:0-3:1");
});

test("multiple --pattern flags", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--pattern",
    "./fixtures/two-functions.js",
  ]);
  await run.completion;
  const result = run.cleanResult();
  expect(result.code).toBe(0);
  expect(result.stderr).toContain("Found 2 files.");
  expect(result.stderr).toContain("3 total matches:");
  expect(result.stdout).toContain("./fixtures/simple.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:5:0-7:1");
});
