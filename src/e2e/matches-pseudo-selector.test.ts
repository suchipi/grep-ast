import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test(":matches() pseudo selector", async () => {
  const run = spawn("node", [
    cliPath,
    ":matches(FunctionDeclaration, ReturnStatement)",
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
    ./fixtures/simple.js:1:0-3:1
    > 1 | function hello() {
        | ^^^^^^^^^^^^^^^^^^
    > 2 |   return "world";
        | ^^^^^^^^^^^^^^^^^
    > 3 | }
        | ^^
      4 |

    ./fixtures/simple.js:2:2-2:17
      1 | function hello() {
    > 2 |   return "world";
        |   ^^^^^^^^^^^^^^^
      3 | }
      4 |


    2 total matches:
    ",
      "stdout": "./fixtures/simple.js:1:0-3:1
    ./fixtures/simple.js:2:2-2:17
    ",
    }
  `);
});
