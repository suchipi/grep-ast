/* @flow */
import type { Options } from "./index";
const debug = require("debug")("astgrep");

module.exports = function readArgv(): Options {
  const argv = require("yargs")
    .option("selector", {
      describe: "CSS-like selector string to search AST for",
      type: "string",
    })
    .option("patterns", {
      describe:
        "Glob patterns matching which files to look in. Defaults to '**/*.js'",
      type: "array",
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
    }).argv;

  debug("argv: ", argv);

  const options: Options = {};

  if (argv._[0] || argv.selector) {
    options.selector = argv._[0] || argv.selector;
  }

  if (argv.patterns) {
    options.patterns = argv.patterns;
  }

  if (argv.gitignore != null) {
    options.gitignore = argv.gitignore;
  }

  if (argv.encoding) {
    options.encoding = argv.encoding;
  }

  if (argv.parser) {
    // $FlowFixMe
    options.parser = require(argv.parser);
  }

  if (argv.parserOptions) {
    options.parserOptions = JSON.parse(argv.parserOptions);
  }

  if (!options.selector) {
    throw new Error("Please specify a selector string to query for");
  }

  debug("options: ", options);

  return options;
};
