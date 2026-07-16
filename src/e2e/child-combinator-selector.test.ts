import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("child combinator selector", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration > BlockStatement > ReturnStatement",
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
