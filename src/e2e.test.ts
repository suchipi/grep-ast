import { test, expect } from "vitest";
import { spawn } from "first-base";

const cliPath = require.resolve("../dist/cli.js");

test("help text", async () => {
  const run = spawn("node", [cliPath, "--help"]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 0,
      "error": false,
      "stderr": "",
      "stdout": "Options:
      --help           Show help                                           [boolean]
      --version        Show version number                                 [boolean]
      --selector       CSS-like selector string to search AST for           [string]
      --patterns       Space-separated list of glob patterns matching which files to
                        look in. Defaults to './**/*.{js,jsx}'.              [string]
      --ignore         Comma-separated list of glob patterns to ignore      [string]
      --gitignore      Whether to omit files listed in your .gitignore file(s).
                        Defaults to 'true'.                 [boolean] [default: true]
      --encoding       The encoding to read your files as. Defaults to 'utf-8'.
                                                                            [string]
      --parser         The name of a parser module to use to parse your files. It
                        should have a parse function on it. Defaults to
                        '@babel/parser'.                                     [string]
      --parserOptions  Options to pass to your parser's parse function, encoded as a
                        JSON string.                                         [string]
      --getLoc         Function that receives an AST node and returns an object
                        describing the node's location. Defaults to 'node =>
                        node.loc'.                                           [string]
    ",
    }
  `);
});

test("version flag", async () => {
  const run = spawn("node", [cliPath, "--version"]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "",
        "stdout": "0.5.0
      ",
      }
    `);
});

test("no selector - exits with error", async () => {
  const run = spawn("node", [cliPath, "--patterns", "./fixtures/simple.js"]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
    {
      "code": 1,
      "error": false,
      "stderr": "Error: Please specify a selector string to query for

    ./dist/parseArgv.js:51:15                                                       
    49   |     }
    50   |     if (!options.selector) {
    51 > |         throw new Error("Please specify a selector string to query for");
    52   |     }
    53   |     debug("passed options: ", options);
    54   |     const { patterns = defaults_1.default.patterns, gitignore = defau...
      at somewhere
    ",
      "stdout": "",
    }
  `);
});

test("basic selector match - FunctionDeclaration", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
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

test("selector with no matches", async () => {
  const run = spawn("node", [
    cliPath,
    "ClassDeclaration",
    "--patterns",
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

test("multiple matches in one file", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
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
      ./fixtures/two-functions.js:1:0-3:1
      > 1 | function foo() {
          | ^^^^^^^^^^^^^^^^
      > 2 |   return 1;
          | ^^^^^^^^^^^
      > 3 | }
          | ^^
        4 |
        5 | function bar() {
        6 |   return 2;

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


      2 total matches:
      ",
        "stdout": "./fixtures/two-functions.js:1:0-3:1
      ./fixtures/two-functions.js:5:0-7:1
      ",
      }
    `);
});

test("complex selector - AssignmentExpression with module.exports", async () => {
  const run = spawn("node", [
    cliPath,
    "AssignmentExpression > MemberExpression[object.name=module][property.name=exports]",
    "--patterns",
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

test("dynamic require selector from README", async () => {
  const run = spawn("node", [
    cliPath,
    "CallExpression[callee.name=require]:not([arguments.0.type=StringLiteral])",
    "--patterns",
    "./fixtures/dynamic-require.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/dynamic-require.js"] (gitignore: enabled)
      ✔ Found 1 files.
      - Parsing files...
      ✔ Parsed files.

      Results:
      ./fixtures/dynamic-require.js:2:12-2:25
        1 | const name = "fs";
      > 2 | const mod = require(name);
          |             ^^^^^^^^^^^^^
        3 |


      1 total matches:
      ",
        "stdout": "./fixtures/dynamic-require.js:2:12-2:25
      ",
      }
    `);
});

test("arrow function expression matching", async () => {
  const run = spawn("node", [
    cliPath,
    "ArrowFunctionExpression",
    "--patterns",
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

test("JSX file support", async () => {
  const run = spawn("node", [
    cliPath,
    "JSXElement",
    "--patterns",
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

test("parse error handling", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
    "./fixtures/syntax-error.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 1,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/syntax-error.js"] (gitignore: enabled)
      ✔ Found 1 files.
      - Parsing files...
      ✔ Parsed files.

      Results:
      Failed to parse './fixtures/syntax-error.js': Unexpected keyword 'return'. (2:2)

      0 total matches:
      ",
        "stdout": "",
      }
    `);
});

test("invalid selector", async () => {
  const run = spawn("node", [
    cliPath,
    "%%%invalid%%%",
    "--patterns",
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

test("empty file - no matches", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
    "./fixtures/empty.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/empty.js"] (gitignore: enabled)
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

test("--selector named flag works same as positional", async () => {
  const run = spawn("node", [
    cliPath,
    "--selector",
    "FunctionDeclaration",
    "--patterns",
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

test("--patterns with glob pattern", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
    "./fixtures/*.js",
  ]);
  await run.completion;
  const result = run.cleanResult();
  // exit code 1 because syntax-error.js causes a parse error
  expect(result.code).toBe(1);
  expect(result.stderr).toContain("Found 7 files.");
  expect(result.stderr).toContain("3 total matches:");
  expect(result.stderr).toContain(
    "Failed to parse './fixtures/syntax-error.js'"
  );
  expect(result.stderr).toContain("./fixtures/simple.js:");
  expect(result.stderr).toContain("./fixtures/two-functions.js:");
  expect(result.stdout).toContain("./fixtures/simple.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:5:0-7:1");
});

test("--patterns with recursive glob includes nested files", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
    "./fixtures/**/*.js",
  ]);
  await run.completion;
  const result = run.cleanResult();
  expect(result.code).toBe(1);
  expect(result.stderr).toContain("Found 8 files.");
  expect(result.stderr).toContain("4 total matches:");
  expect(result.stderr).toContain(
    "Failed to parse './fixtures/syntax-error.js'"
  );
  expect(result.stdout).toContain("./fixtures/simple.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:5:0-7:1");
  expect(result.stdout).toContain("./fixtures/nested/deep.js:1:0-3:1");
});

test("--ignore excludes matching files", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
    "./fixtures/**/*.js",
    "--ignore",
    "./fixtures/nested/**",
  ]);
  await run.completion;
  const result = run.cleanResult();
  expect(result.code).toBe(1);
  expect(result.stderr).toContain(
    '["./fixtures/**/*.js","!./fixtures/nested/**"]'
  );
  expect(result.stderr).toContain("Found 7 files.");
  expect(result.stderr).toContain("3 total matches:");
  expect(result.stderr).toContain(
    "Failed to parse './fixtures/syntax-error.js'"
  );
  expect(result.stdout).toContain("./fixtures/simple.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:5:0-7:1");
  // nested/deep.js should be excluded by --ignore
  expect(result.stdout).not.toContain("nested/deep.js");
});

test("--no-gitignore flag", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
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

test("multiple space-separated patterns", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
    "./fixtures/simple.js ./fixtures/two-functions.js",
  ]);
  await run.completion;
  const result = run.cleanResult();
  expect(result.code).toBe(0);
  expect(result.stderr).toContain("Found 2 files.");
  expect(result.stderr).toContain("3 total matches:");
  expect(result.stdout).toContain("./fixtures/simple.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:1:0-3:1");
  expect(result.stdout).toContain("./fixtures/two-functions.js:5:0-7:1");
});

test("stdout has match locations, stderr has code frames and details", async () => {
  const run = spawn("node", [
    cliPath,
    "ReturnStatement",
    "--patterns",
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
      ./fixtures/simple.js:2:2-2:17
        1 | function hello() {
      > 2 |   return "world";
          |   ^^^^^^^^^^^^^^^
        3 | }
        4 |


      1 total matches:
      ",
        "stdout": "./fixtures/simple.js:2:2-2:17
      ",
      }
    `);
});

test("output includes line and column info", async () => {
  const run = spawn("node", [
    cliPath,
    "StringLiteral",
    "--patterns",
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
      ./fixtures/simple.js:2:9-2:16
        1 | function hello() {
      > 2 |   return "world";
          |          ^^^^^^^
        3 | }
        4 |


      1 total matches:
      ",
        "stdout": "./fixtures/simple.js:2:9-2:16
      ",
      }
    `);
});

test("Identifier selector", async () => {
  const run = spawn("node", [
    cliPath,
    "Identifier",
    "--patterns",
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

test("ReturnStatement selector", async () => {
  const run = spawn("node", [
    cliPath,
    "ReturnStatement",
    "--patterns",
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

test("descendant combinator selector", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration ReturnStatement",
    "--patterns",
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
      ./fixtures/simple.js:2:2-2:17
        1 | function hello() {
      > 2 |   return "world";
          |   ^^^^^^^^^^^^^^^
        3 | }
        4 |


      1 total matches:
      ",
        "stdout": "./fixtures/simple.js:2:2-2:17
      ",
      }
    `);
});

test("child combinator selector", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration > BlockStatement > ReturnStatement",
    "--patterns",
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
      ./fixtures/simple.js:2:2-2:17
        1 | function hello() {
      > 2 |   return "world";
          |   ^^^^^^^^^^^^^^^
        3 | }
        4 |


      1 total matches:
      ",
        "stdout": "./fixtures/simple.js:2:2-2:17
      ",
      }
    `);
});

test("attribute selector with value", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration[id.name=hello]",
    "--patterns",
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

test("attribute selector that doesn't match", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration[id.name=nonexistent]",
    "--patterns",
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

test(":not() pseudo selector", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration:not([id.name=foo])",
    "--patterns",
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

test("patterns with no matching files", async () => {
  const run = spawn("node", [
    cliPath,
    "FunctionDeclaration",
    "--patterns",
    "./fixtures/nonexistent-*.js",
  ]);
  await run.completion;
  expect(run.cleanResult()).toMatchInlineSnapshot(`
      {
        "code": 0,
        "error": false,
        "stderr": "- Matching patterns: ["./fixtures/nonexistent-*.js"] (gitignore: enabled)
      ✔ Found 0 files.
      - Parsing files...
      ✔ Parsed files.

      Results:

      0 total matches:
      ",
        "stdout": "",
      }
    `);
});

test("JSXIdentifier selector in JSX file", async () => {
  const run = spawn("node", [
    cliPath,
    "JSXIdentifier",
    "--patterns",
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

test("TemplateLiteral selector", async () => {
  const run = spawn("node", [
    cliPath,
    "TemplateLiteral",
    "--patterns",
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
    "--patterns",
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
