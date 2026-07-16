import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test(":has() pseudo selector", async () => {
  const run = spawn("node", [
    cliPath,
    "VariableDeclaration:has(TemplateLiteral)",
    "--pattern",
    "./fixtures/arrow-functions.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "- Matching patterns: ["./fixtures/arrow-functions.js"] (gitignore: enabled)
    ✔ Found 1 files.
    - Parsing files...
    ✔ Parsed files.

    Results:
    ./fixtures/arrow-functions.js:2:0-2:42
      1 | const add = (a, b) => a + b;
    > 2 | const greet = (name) => \`Hello, \${name}!\`;
        | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      3 |


    1 total matches:
    ",
      "stdout": "./fixtures/arrow-functions.js:2:0-2:42
    ",
    }
  `);
});
