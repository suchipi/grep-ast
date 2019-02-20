/* @flow */
import type { Argv, Result } from "./types";
const debug = require("debug")(
  "grep-ast:" + String(process.env.JEST_WORKER_ID)
);
const fs = require("fs");
const esquery = require("@suchipi/esquery").configure({
  getKeys(node) {
    return Object.keys(node);
  },
});
const pify = require("pify");
const fsp = pify(fs);
const parseArgv = require("./parseArgv");

exports.processFile = async (
  filepath: string,
  argv: Argv
): Promise<Array<Result>> => {
  const options = parseArgv(argv);
  const { encoding, parser, parserOptions, selector, getLoc } = options;

  let contents;
  try {
    debug(`Reading ${filepath}`);
    contents = await fsp.readFile(filepath, encoding);
  } catch (err) {
    return [
      {
        filepath,
        error: true,
        message: `Failed to read '${filepath}': ${err.message}`,
      },
    ];
  }

  let ast;
  try {
    debug(`Parsing ${filepath}`);
    ast = parser.parse(contents, parserOptions);
  } catch (err) {
    debug(`Failed to parse '${filepath}'`);
    return [
      {
        filepath,
        error: true,
        message: `Failed to parse '${filepath}': ${err.message}`,
      },
    ];
  }

  let nodes;
  try {
    debug(`Querying AST for '${filepath}'`);
    nodes = esquery.query(ast, selector);
  } catch (err) {
    debug(`Failed to query AST for '${filepath}'`);
    return [
      {
        filepath,
        error: true,
        message: `Failed to query AST for '${filepath}': ${err.message}`,
      },
    ];
  }

  return nodes.map((node) => {
    return {
      filepath,
      error: false,
      loc: getLoc(node),
      contents,
    };
  });
};
