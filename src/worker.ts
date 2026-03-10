import type { Argv, Result } from "./types";
import makeDebug from "debug";
import esqueryModule from "@suchipi/esquery";
import fsp from "fs/promises";
import parseArgv from "./parseArgv";

const debug = makeDebug("grep-ast:" + String(process.env.JEST_WORKER_ID));
const esquery = esqueryModule.configure({
  getKeys(node: {}) {
    return Object.keys(node);
  },
});

function getErrorMessage(err: unknown) {
  try {
    if (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof err.message === "string"
    ) {
      return err.message;
    } else {
      return String(err);
    }
  } catch (_err2) {
    return String(err);
  }
}

export const processFile = async (
  filepath: string,
  argv: Argv
): Promise<Array<Result>> => {
  const options = parseArgv(argv);
  const { encoding, parser, parserOptions, selector, getLoc } = options;

  let contents: string;
  try {
    debug(`Reading ${filepath}`);
    contents = (await fsp.readFile(filepath, encoding)).toString();
  } catch (err: unknown) {
    return [
      {
        filepath,
        error: true,
        message: `Failed to read '${filepath}': ${getErrorMessage(err)}`,
      },
    ];
  }

  let ast;
  try {
    debug(`Parsing ${filepath}`);
    ast = parser.parse(contents, {
      ...parserOptions,
      fileName: filepath,
    });
  } catch (err: unknown) {
    debug(`Failed to parse '${filepath}'`);
    return [
      {
        filepath,
        error: true,
        message: `Failed to parse '${filepath}': ${getErrorMessage(err)}`,
      },
    ];
  }

  let nodes: Array<{
    loc: {
      start: { line: number; column: number };
      end: { line: number; column: number };
    };
  }>;
  try {
    debug(`Querying AST for '${filepath}'`);
    nodes = esquery.query(ast, selector);
  } catch (err: unknown) {
    debug(`Failed to query AST for '${filepath}'`);
    return [
      {
        filepath,
        error: true,
        message: `Failed to query AST for '${filepath}': ${getErrorMessage(
          err
        )}`,
      },
    ];
  }

  return nodes.map((node) => {
    return {
      filepath,
      error: false as const,
      message: "",
      loc: getLoc(node),
      contents,
    };
  });
};
