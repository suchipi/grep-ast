import { test, expect } from "vitest";
import { spawn } from "first-base";
import { cliPath } from "./test-helpers";

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
      --pattern        Glob pattern matching which files to look in. Defaults to
                       './**/*.{c,m,}{j,t}s{,x}'.  Use flag more than once to
                       provide more than one glob pattern.                  [string]
      --ignore         Glob pattern to ignore (gets prefixed with '!'). Use flag
                       more than once to provide more than one ignore
                       pattern.                                             [string]
      --gitignore      Whether to omit files listed in your .gitignore file(s).
                       Defaults to 'true'.                 [boolean] [default: true]
      --encoding       The encoding to read your files as. Defaults to
                       'utf-8'.                                             [string]
      --parser         The name of a parser module to use to parse your files. It
                       should export a parse function. Defaults to
                       'equivalent-exchange'.                               [string]
      --parserOptions  Options to pass to your parser's parse function, encoded as
                       a JSON string.                                       [string]
      --getLoc         Function that receives an AST node and returns an object
                       describing the node's location. Defaults to 'node =>
                       node.loc'.                                           [string]
    ",
    }
  `);
});
