/* @flow */
const debug = require("debug")("grep-ast");
const globby = require("globby");
const Worker = require("jest-worker").default;
const parseArgv = require("./parseArgv");
import type { Argv } from "./readArgv";
import type { Result } from "./worker";

module.exports = async function grepAst(
  argv: Argv,
  onGlobResolved: (files: Array<string>) => void
): Promise<Array<Result>> {
  const options = parseArgv(argv);
  const { patterns, gitignore } = options;

  debug(`Matching patterns '${patterns.join(", ")}'...`);
  const files = await globby(patterns, { gitignore });
  debug("Files matched:", files);
  onGlobResolved(files);
  const results: Array<Result> = [];

  const worker = new Worker(require.resolve("./worker"));
  worker.getStdout().pipe(process.stdout);
  worker.getStderr().pipe(process.stderr);
  await Promise.all(
    files.map(async (filepath) => {
      try {
        const resultsFromWorker = await worker.processFile(filepath, argv);
        results.push(...resultsFromWorker);
      } catch (err) {
        results.push({
          filepath,
          error: true,
          message: "Worker failed: " + err.stack,
        });
      }
    })
  );
  worker.end();

  return results;
};
