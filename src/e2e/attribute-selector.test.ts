import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("attribute selector with value", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration[id.name=hello]",
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


      1 total matches:
      ",
        "stdout": "./fixtures/simple.js:1:0-3:1
      ",
      }
    `);
});

test("attribute selector with regex value", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration[id.name=/^b/]",
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


    1 total matches:
    ",
      "stdout": "./fixtures/two-functions.js:5:0-7:1
    ",
    }
  `);
});

test("attribute selector with negated value", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration[id.name!=foo]",
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


    1 total matches:
    ",
      "stdout": "./fixtures/two-functions.js:5:0-7:1
    ",
    }
  `);
});

test("attribute selector that doesn't match", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration[id.name=nonexistent]",
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
