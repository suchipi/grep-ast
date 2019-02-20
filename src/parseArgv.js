/* @flow */
const path = require("path");
const vm = require("vm");
const debug = require("debug")("grep-ast");
const resolve = require("resolve");
const makeModuleEnv = require("make-module-env");
const defaults = require("./defaults");
import type { Argv } from "./readArgv";
import type { Loc } from "./loc";

export type Options = $Shape<{
  selector: string,
  patterns: Array<string>,
  gitignore: boolean,
  encoding: string,
  parser: {
    parse: (code: string, options: Object) => Object,
  },
  parserOptions: Object,
  getLoc: (node: Object) => Loc,
}>;

module.exports = function parseArgv(argv: Argv): Options {
  const options: Options = {};

  if (argv._[0] || argv.selector) {
    options.selector = argv._[0] || argv.selector;
  }

  if (argv.patterns) {
    options.patterns = argv.patterns.split(" ");
  } else {
    options.patterns = defaults.patterns;
  }

  if (argv.ignore) {
    options.patterns = options.patterns.concat(
      argv.ignore.split(",").map((dir) => `!${dir}`)
    );
  }

  if (argv.gitignore != null) {
    options.gitignore = argv.gitignore;
  }

  if (argv.encoding) {
    options.encoding = argv.encoding;
  }

  if (argv.parser) {
    // $FlowFixMe
    options.parser = require(resolve.sync(argv.parser, {
      basedir: process.cwd(),
    }));
  }

  if (argv.getLoc) {
    options.getLoc = vm.runInNewContext(
      argv.getLoc,
      makeModuleEnv(path.join(process.cwd(), "grep-ast.js"))
    );
  }

  if (argv.parserOptions) {
    options.parserOptions = JSON.parse(argv.parserOptions);
  }

  if (!options.selector) {
    throw new Error("Please specify a selector string to query for");
  }

  debug("passed options: ", options);

  const {
    patterns = defaults.patterns,
    gitignore = defaults.gitignore,
    encoding = defaults.encoding,
    parser = defaults.parser,
    parserOptions = defaults.parserOptions,
    getLoc = defaults.getLoc,
  } = options;

  const resolvedOptions = {
    selector: options.selector,
    patterns,
    gitignore,
    encoding,
    parser,
    parserOptions,
    getLoc,
  };

  debug("resolved options: ", resolvedOptions);

  return resolvedOptions;
};
