import type { Argv, Options } from "./types";
import path from "path";
import vm from "vm";
import makeDebug from "debug";
import resolve from "resolve";
import makeModuleEnv from "make-module-env";
import defaults from "./defaults";

const debug = makeDebug("grep-ast");

export default function parseArgv(argv: Argv): Options {
  const options: Partial<Options> = {};

  if (argv._?.[0] || argv.selector) {
    options.selector = argv._?.[0] || argv.selector;
  }

  if (argv.patterns) {
    options.patterns = argv.patterns.split(" ");
  } else {
    options.patterns = defaults.patterns;
  }

  if (argv.ignore) {
    options.patterns = options.patterns!.concat(
      argv.ignore.split(",").map((dir: string) => `!${dir}`)
    );
  }

  if (argv.gitignore != null) {
    options.gitignore = argv.gitignore;
  }

  if (argv.encoding) {
    if (Buffer.isEncoding(argv.encoding)) {
      options.encoding = argv.encoding;
    } else {
      throw new Error(`Invalid buffer encoding: ${argv.encoding}`);
    }
  }

  if (argv.parser) {
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

  const resolvedOptions: Options = {
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
}
