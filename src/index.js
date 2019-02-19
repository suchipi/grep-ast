/* @flow */
const debug = require("debug")("grep-ast");
const globby = require("globby");
const fs = require("fs");
const esquery = require("@suchipi/esquery").configure({
  getKeys(node) {
    return Object.keys(node);
  },
});
const pify = require("pify");
const fsp = pify(fs);
const defaults = require("./defaults");

export type Loc = {
  start: {
    line: number,
    column: number,
  },
  end: {
    line: number,
    column: number,
  },
};

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

export type Result =
  | {
      filepath: string,
      error: true,
      message: string,
    }
  | {
      filepath: string,
      error: false,
      message: string,
      loc: Loc,
      contents: string,
    };

module.exports = async function grepAst(
  {
    selector,
    patterns = defaults.patterns,
    gitignore = defaults.gitignore,
    encoding = defaults.encoding,
    parser = defaults.parser,
    parserOptions = defaults.parserOptions,
    getLoc = defaults.getLoc,
  }: Options,
  onGlobResolved: (files: Array<string>) => void
): Promise<Array<Result>> {
  debug(`Matching patterns '${patterns.join(", ")}'...`);
  const files = await globby(patterns, { gitignore });
  debug("Files matched:", files);
  onGlobResolved(files);
  const results: Array<Result> = [];

  await Promise.all(
    files.map(async (filepath, index) => {
      let contents;
      try {
        debug(`Reading ${filepath}`);
        contents = await fsp.readFile(filepath, encoding);
      } catch (err) {
        results.push({
          filepath,
          error: true,
          message: `Failed to read '${filepath}': ${err.message}`,
        });
        return;
      }

      let ast;
      try {
        debug(`Parsing ${filepath}`);
        ast = parser.parse(contents, parserOptions);
      } catch (err) {
        debug(`Failed to parse '${filepath}'`);
        results.push({
          filepath,
          error: true,
          message: `Failed to parse '${filepath}': ${err.message}`,
        });
        return;
      }

      let nodes;
      try {
        debug(`Querying AST for '${filepath}'`);
        nodes = esquery.query(ast, selector);
      } catch (err) {
        debug(`Failed to query AST for '${filepath}'`);
        results.push({
          filepath,
          error: true,
          message: `Failed to query AST for '${filepath}': ${err.message}`,
        });
        return;
      }

      nodes.forEach((node) => {
        results.push({
          filepath,
          error: false,
          loc: getLoc(node),
          contents,
        });
      });
    })
  );

  return results;
};
