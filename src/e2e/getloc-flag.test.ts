import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("--getLoc is used to locate matches", async () => {
  // returning the id's loc instead of the node's own loc points the result at
  // 'hello' rather than at the whole function declaration
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--getLoc",
    "node => node.id.loc",
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
    ./fixtures/simple.js:1:9-1:14
    > 1 | function hello() {
        |          ^^^^^
      2 |   return "world";
      3 | }
      4 |


    1 total matches:
    ",
      "stdout": "./fixtures/simple.js:1:9-1:14
    ",
    }
  `);
});

test("--getLoc returning nothing - warns about missing location info", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--getLoc",
    "node => null",
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
    Warning: Failed to obtain line/column info for following match. Check that the --getLoc value you specified is correct.
    ./fixtures/simple.js

    1 total matches:
    ",
      "stdout": "./fixtures/simple.js
    ",
    }
  `);
});
