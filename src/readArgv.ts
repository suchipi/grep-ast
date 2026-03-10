import type { Argv } from "./types";
import makeDebug from "debug";
import { parseArgv } from "clef-parse";

const debug = makeDebug("grep-ast");

let argv: Argv;
export default function readArgv(): Argv {
  if (argv) {
    return argv;
  }

  const result = parseArgv(process.argv.slice(2), {
    selector: String,
    patterns: String,
    ignore: String,
    gitignore: Boolean,
    encoding: String,
    parser: String,
    parserOptions: String,
    getLoc: String,
    help: Boolean,
    version: Boolean,
  });

  if (result.options.help) {
    console.log(
      `
Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --selector       CSS-like selector string to search AST for           [string]
  --patterns       Space-separated list of glob patterns matching which files to
                    look in. Defaults to './**/*.[cm]?[jt]sx?'.         [string]
  --ignore         Comma-separated list of glob patterns to ignore      [string]
  --gitignore      Whether to omit files listed in your .gitignore file(s).
                    Defaults to 'true'.                [boolean] [default: true]
  --encoding       The encoding to read your files as. Defaults to 'utf-8'.
                                                                        [string]
  --parser         The name of a parser module to use to parse your files. It
                    should have a parse function on it. Defaults to
                    '@babel/parser'.                                    [string]
  --parserOptions  Options to pass to your parser's parse function, encoded as a
                    JSON string.                                        [string]
  --getLoc         Function that receives an AST node and returns an object
                    describing the node's location. Defaults to 'node =>
                    node.loc'.                                          [string]
`.trim()
    );
    process.exit(0);
  } else if (result.options.version) {
    console.log(require("../package.json").version);
    process.exit(0);
  }

  argv = {
    ...result.options,
    _: result.positionalArgs,
  };

  debug("argv: ", argv);

  return argv;
}
