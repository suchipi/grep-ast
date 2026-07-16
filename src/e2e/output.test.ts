import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("output includes line and column info", async () => {
  const run = spawn("node", [
    cliPath,
    "StringLiteral",
    "--pattern",
    "./fixtures/simple.js",
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
      ./fixtures/simple.js:2:9-2:16
        1 | function hello() {
      > 2 |   return "world";
          |          ^^^^^^^
        3 | }
        4 |


      1 total matches:
      ",
        "stdout": "./fixtures/simple.js:2:9-2:16
      ",
      }
    `);
});

test("stdout has match locations, stderr has code frames and details", async () => {
  const run = spawn("node", [
    cliPath,
    "ReturnStatement",
    "--pattern",
    "./fixtures/simple.js",
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
      ./fixtures/simple.js:2:2-2:17
        1 | function hello() {
      > 2 |   return "world";
          |   ^^^^^^^^^^^^^^^
        3 | }
        4 |


      1 total matches:
      ",
        "stdout": "./fixtures/simple.js:2:2-2:17
      ",
      }
    `);
});
