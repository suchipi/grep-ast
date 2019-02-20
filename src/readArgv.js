/* @flow */
const debug = require("debug")("grep-ast");

export type Argv = $Shape<{
  selector: string,
  patterns: string,
  ignore: string,
  gitignore: boolean,
  encoding: string,
  parser: string,
  parserOptions: string,
  getLoc: string,
  _: [string],
}>;

let argv: Argv;
module.exports = function readArgv(): Argv {
  if (argv) {
    return argv;
  }

  argv = require("yargs")
    .option("selector", {
      describe: "CSS-like selector string to search AST for",
      type: "string",
    })
    .option("patterns", {
      describe:
        "Space-separated list of glob patterns matching which files to look in. Defaults to './**/*.{js,jsx}'.",
      type: "string",
    })
    .option("ignore", {
      describe: "Comma-separated list of glob patterns to ignore",
      type: "string",
    })
    .option("gitignore", {
      default: true,
      describe:
        "Whether to omit files listed in your .gitignore file(s). Defaults to 'true'.",
      type: "boolean",
    })
    .option("encoding", {
      describe: "The encoding to read your files as. Defaults to 'utf-8'.",
      type: "string",
    })
    .option("parser", {
      describe:
        "The name of a parser module to use to parse your files. It should have a parse function on it. Defaults to '@babel/parser'.",
      type: "string",
    })
    .option("parserOptions", {
      describe:
        "Options to pass to your parser's parse function, encoded as a JSON string.",
      type: "string",
    })
    .option("getLoc", {
      describe:
        "Function that receives an AST node and returns an object describing the node's location. Defaults to 'node => node.loc'.",
      type: "string",
    }).argv;

  debug("argv: ", argv);

  return argv;
};
