import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("--parser with a different parser module", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--parser",
    "@babel/parser",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "- Matching patterns: ["./fixtures/simple.js"] (gitignore: enabled)
    ✔ Found 1 files.
    - Parsing files...
    ✔ Parsed files.

    Results:
    ./fixtures/simple.js:1:0-3:1
    > 1 | function hello() {
        | ^^^^^^^^^^^^^^^^^^
    > 2 |   return "world";
        | ^^^^^^^^^^^^^^^^^
    > 3 | }
        | ^^
      4 |


    1 total matches:
    ",
      "stdout": "./fixtures/simple.js:1:0-3:1
    ",
    }
  `);
});

test("--parser equivalent-exchange (the default) explicitly", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--parser",
    "equivalent-exchange",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "- Matching patterns: ["./fixtures/simple.js"] (gitignore: enabled)
    ✔ Found 1 files.
    - Parsing files...
    ✔ Parsed files.

    Results:
    ./fixtures/simple.js:1:0-3:1
    > 1 | function hello() {
        | ^^^^^^^^^^^^^^^^^^
    > 2 |   return "world";
        | ^^^^^^^^^^^^^^^^^
    > 3 | }
        | ^^
      4 |


    1 total matches:
    ",
      "stdout": "./fixtures/simple.js:1:0-3:1
    ",
    }
  `);
});

test("--parser that can't be resolved - exits with error", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--parser",
    "./nonexistent-parser.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Cannot find module './nonexistent-parser.js' from '<rootDir>'
      at somewhere
    The above error also had these properties on it:
    { code: 'MODULE_NOT_FOUND' }
    ",
      "stdout": "",
    }
  `);
});
