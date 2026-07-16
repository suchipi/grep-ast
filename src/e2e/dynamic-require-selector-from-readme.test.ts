import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("dynamic require selector from README", async () => {
  const run = spawn("node", [
    cliPath,
    "CallExpression[callee.name=require]:not([arguments.0.type=StringLiteral])",
    "--pattern",
    "./fixtures/dynamic-require.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/dynamic-require.js"] (gitignore: enabled)
      ✔ Found 1 files.
      - Parsing files...
      ✔ Parsed files.

      Results:
      ./fixtures/dynamic-require.js:2:12-2:25
        1 | const name = "fs";
      > 2 | const mod = require(name);
          |             ^^^^^^^^^^^^^
        3 |


      1 total matches:
      ",
        "stdout": "./fixtures/dynamic-require.js:2:12-2:25
      ",
      }
    `);
});
