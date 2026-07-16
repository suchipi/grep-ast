import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("basic selector match - FunctionDeclaration", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
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

test("arrow function expression matching", async () => {
  const run = spawn("node", [
    cliPath,
    "ArrowFunctionExpression",
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
      ./fixtures/arrow-functions.js:1:12-1:27
      > 1 | const add = (a, b) => a + b;
          |             ^^^^^^^^^^^^^^^
        2 | const greet = (name) => \`Hello, \${name}!\`;
        3 |

      ./fixtures/arrow-functions.js:2:14-2:41
        1 | const add = (a, b) => a + b;
      > 2 | const greet = (name) => \`Hello, \${name}!\`;
          |               ^^^^^^^^^^^^^^^^^^^^^^^^^^^
        3 |


      2 total matches:
      ",
        "stdout": "./fixtures/arrow-functions.js:1:12-1:27
      ./fixtures/arrow-functions.js:2:14-2:41
      ",
      }
    `);
});

test("Identifier selector", async () => {
  const run = spawn("node", [
    cliPath,
    "Identifier",
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

test("TemplateLiteral selector", async () => {
  const run = spawn("node", [
    cliPath,
    "TemplateLiteral",
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
      ./fixtures/arrow-functions.js:2:24-2:41
        1 | const add = (a, b) => a + b;
      > 2 | const greet = (name) => \`Hello, \${name}!\`;
          |                         ^^^^^^^^^^^^^^^^^
        3 |


      1 total matches:
      ",
        "stdout": "./fixtures/arrow-functions.js:2:24-2:41
      ",
      }
    `);
});

test("VariableDeclaration selector", async () => {
  const run = spawn("node", [
    cliPath,
    "VariableDeclaration",
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
      ./fixtures/arrow-functions.js:1:0-1:28
      > 1 | const add = (a, b) => a + b;
          | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        2 | const greet = (name) => \`Hello, \${name}!\`;
        3 |

      ./fixtures/arrow-functions.js:2:0-2:42
        1 | const add = (a, b) => a + b;
      > 2 | const greet = (name) => \`Hello, \${name}!\`;
          | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        3 |


      2 total matches:
      ",
        "stdout": "./fixtures/arrow-functions.js:1:0-1:28
      ./fixtures/arrow-functions.js:2:0-2:42
      ",
      }
    `);
});

test("ReturnStatement selector", async () => {
  const run = spawn("node", [
    cliPath,
    "ReturnStatement",
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
      ./fixtures/two-functions.js:2:2-2:11
        1 | function foo() {
      > 2 |   return 1;
          |   ^^^^^^^^^
        3 | }
        4 |
        5 | function bar() {

      ./fixtures/two-functions.js:6:2-6:11
        4 |
        5 | function bar() {
      > 6 |   return 2;
          |   ^^^^^^^^^
        7 | }
        8 |


      2 total matches:
      ",
        "stdout": "./fixtures/two-functions.js:2:2-2:11
      ./fixtures/two-functions.js:6:2-6:11
      ",
      }
    `);
});

test("invalid selector", async () => {
  const run = spawn("node", [
    cliPath,
    "%%%invalid%%%",
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

test("no selector - exits with error", async () => {
  const run = spawn("node", [cliPath, "--pattern", "./fixtures/simple.js"]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Please specify a selector string to query for

    ./dist/parseArgv.js:52:15                                                       
    50   |     }
    51   |     if (!options.selector) {
    52 > |         throw new Error("Please specify a selector string to query for");
    53   |     }
    54   |     debug("passed options: ", options);
    55   |     const { patterns = defaults_1.default.patterns, gitignore = defau...
      at somewhere
    ",
      "stdout": "",
    }
  `);
});
