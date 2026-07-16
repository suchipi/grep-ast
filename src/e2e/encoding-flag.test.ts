import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("--encoding utf-8 (the default) explicitly", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--encoding",
    "utf-8",
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

test("--encoding is used when reading files", async () => {
  // reading a utf-8 file as utf16le garbles it, so parsing fails
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--encoding",
    "utf16le",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "- Matching patterns: ["./fixtures/simple.js"] (gitignore: enabled)
    ✔ Found 1 files.
    - Parsing files...
    ✔ Parsed files.

    Results:
    Failed to parse './fixtures/simple.js': Unexpected character '⤨'. (1:7)

    0 total matches:
    ",
      "stdout": "",
    }
  `);
});

test("invalid --encoding - exits with error", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--encoding",
    "bogus-encoding",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Invalid buffer encoding: bogus-encoding

    ./dist/parseArgv.js:36:19                                                       
    34   |         }
    35   |         else {
    36 > |             throw new Error(\`Invalid buffer encoding: \${argv.encoding}\`);
    37   |         }
    38   |     }
    39   |     if (argv.parser) {
      at somewhere
    ",
      "stdout": "",
    }
  `);
});
