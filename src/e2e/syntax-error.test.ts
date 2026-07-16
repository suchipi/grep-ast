import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("parse error handling", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/syntax-error.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/syntax-error.js"] (gitignore: enabled)
      ✔ Found 1 files.
      - Parsing files...
      ✔ Parsed files.

      Results:
      Failed to parse './fixtures/syntax-error.js': Unexpected keyword 'return'. (2:2)

      0 total matches:
      ",
        "stdout": "",
      }
    `);
});
