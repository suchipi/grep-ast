import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("more stuff matches with --gitignore false", async () => {
  const run = spawn("node", [
    cliPath,
    "--gitignore",
    "false",
    "--ignore",
    "node_modules/**",
    "--ignore",
    "./src/e2e/**",
    "--ignore",
    "./vitest.config.ts",
    "Identifier[name=slice]",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "- Matching patterns: ["./**/*.{c,m,}{j,t}s{,x}","!node_modules/**","!./src/e2e/**","!./vitest.config.ts"] (gitignore: disabled)
    ✔ Found 35 files.
    - Parsing files...
    ✔ Parsed files.

    Results:
    Failed to parse 'fixtures/syntax-error.js': Unexpected keyword 'return'. (2:2)
    dist/readArgv.js:15:60-15:65
      13 |         return argv;
      14 |     }
    > 15 |     const result = (0, clef_parse_1.parseArgv)(process.argv.slice(2), {
         |                                                             ^^^^^
      16 |         selector: String,
      17 |         pattern: clef_parse_1.arrayOfStrings,
      18 |         ignore: clef_parse_1.arrayOfStrings,

    src/readArgv.ts:13:40-13:45
      11 |   }
      12 |
    > 13 |   const result = parseArgv(process.argv.slice(2), {
         |                                         ^^^^^
      14 |     selector: String,
      15 |     pattern: arrayOfStrings,
      16 |     ignore: arrayOfStrings,


    2 total matches:
    ",
      "stdout": "dist/readArgv.js:15:60-15:65
    src/readArgv.ts:13:40-13:45
    ",
    }
  `);
});

test("--no-gitignore flag", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--no-gitignore",
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
