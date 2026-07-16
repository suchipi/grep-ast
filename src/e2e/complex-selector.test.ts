import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("complex selector - AssignmentExpression with module.exports", async () => {
  const run = spawn("node", [
    cliPath,
    "AssignmentExpression > MemberExpression[object.name=module][property.name=exports]",
    "--pattern",
    "./fixtures/module-exports.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/module-exports.js"] (gitignore: enabled)
      ✔ Found 1 files.
      - Parsing files...
      ✔ Parsed files.

      Results:
      ./fixtures/module-exports.js:2:0-2:14
        1 | const greeting = "hello";
      > 2 | module.exports = greeting;
          | ^^^^^^^^^^^^^^
        3 |


      1 total matches:
      ",
        "stdout": "./fixtures/module-exports.js:2:0-2:14
      ",
      }
    `);
});
