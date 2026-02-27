import type { Argv, Result } from "./types";

const debug = require("debug")("grep-ast");
const globby = require("globby");
const Worker = require("jest-worker").default;
const parseArgv = require("./parseArgv");

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
    files.map(async (filepath: string) => {
      try {
        const resultsFromWorker = await (worker as { processFile: Function }).processFile(filepath, argv);
        results.push(...resultsFromWorker);
      } catch (err: unknown) {
        results.push({
          filepath,
          error: true,
          message: "Worker failed: " + (err as Error).stack,
        });
      }
    })
  );
  worker.end();

  return results;
};
