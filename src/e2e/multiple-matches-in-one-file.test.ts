import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("multiple matches in one file", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/two-functions.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/two-functions.js"] (gitignore: enabled)
      ✔ Found 1 files.
      - Parsing files...
      ✔ Parsed files.

      Results:
      ./fixtures/two-functions.js:1:0-3:1
      > 1 | function foo() {
          | ^^^^^^^^^^^^^^^^
      > 2 |   return 1;
          | ^^^^^^^^^^^
      > 3 | }
          | ^^
        4 |
        5 | function bar() {
        6 |   return 2;

      ./fixtures/two-functions.js:5:0-7:1
        3 | }
        4 |
      > 5 | function bar() {
          | ^^^^^^^^^^^^^^^^
      > 6 |   return 2;
          | ^^^^^^^^^^^
      > 7 | }
          | ^^
        8 |


      2 total matches:
      ",
        "stdout": "./fixtures/two-functions.js:1:0-3:1
      ./fixtures/two-functions.js:5:0-7:1
      ",
      }
    `);
});
