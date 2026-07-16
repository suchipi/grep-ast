import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

test("JSX file support", async () => {
  const run = spawn("node", [
    cliPath,
    "JSXElement",
    "--pattern",
    "./fixtures/has-jsx.jsx",
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

test("JSXIdentifier selector in JSX file", async () => {
  const run = spawn("node", [
    cliPath,
    "JSXIdentifier",
    "--pattern",
    "./fixtures/has-jsx.jsx",
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
      ./fixtures/has-jsx.jsx:2:10-2:13
        1 | function App() {
      > 2 |   return <div>Hello</div>;
          |           ^^^
        3 | }
        4 |

      ./fixtures/has-jsx.jsx:2:21-2:24
        1 | function App() {
      > 2 |   return <div>Hello</div>;
          |                      ^^^
        3 | }
        4 |


      2 total matches:
      ",
        "stdout": "./fixtures/has-jsx.jsx:2:10-2:13
      ./fixtures/has-jsx.jsx:2:21-2:24
      ",
      }
    `);
});
