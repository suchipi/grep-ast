import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("--parserOptions are passed to the parser", async () => {
  const run = spawn("node", [
    cliPath,
    "JSXElement",
    "--pattern",
    "./fixtures/has-jsx.jsx",
    "--parser",
    "@babel/parser",
    "--parserOptions",
    '{"plugins":["jsx"]}',
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "- Matching patterns: ["./fixtures/has-jsx.jsx"] (gitignore: enabled)
    ✔ Found 1 files.
    - Parsing files...
    ✔ Parsed files.

    Results:
    ./fixtures/has-jsx.jsx:2:9-2:25
      1 | function App() {
    > 2 |   return <div>Hello</div>;
        |          ^^^^^^^^^^^^^^^^
      3 | }
      4 |


    1 total matches:
    ",
      "stdout": "./fixtures/has-jsx.jsx:2:9-2:25
    ",
    }
  `);
});

test("without --parserOptions, the parser gets none", async () => {
  // contrast with the test above: @babel/parser only parses jsx when its jsx
  // plugin is enabled, so the match found there depends on --parserOptions
  const run = spawn("node", [
    cliPath,
    "JSXElement",
    "--pattern",
    "./fixtures/has-jsx.jsx",
    "--parser",
    "@babel/parser",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "- Matching patterns: ["./fixtures/has-jsx.jsx"] (gitignore: enabled)
    ✔ Found 1 files.
    - Parsing files...
    ✔ Parsed files.

    Results:
    Failed to parse './fixtures/has-jsx.jsx': This experimental syntax requires enabling one of the following parser plugin(s): "jsx", "flow", "typescript". (2:9)

    0 total matches:
    ",
      "stdout": "",
    }
  `);
});

test("invalid JSON in --parserOptions - exits with error", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--pattern",
    "./fixtures/simple.js",
    "--parserOptions",
    "not-json",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "SyntaxError: Unexpected token 'o', "not-json" is not valid JSON
      at somewhere
    ",
      "stdout": "",
    }
  `);
});
