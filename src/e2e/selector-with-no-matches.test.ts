import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("selector with no matches", async () => {
  const run = spawn("node", [
    cliPath,
    "ClassDeclaration",
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

      0 total matches:
      ",
        "stdout": "",
      }
    `);
});
