import type { Argv, Result } from "./types";
import makeDebug from "debug";
import globby from "globby";
import Worker from "jest-worker";
import parseArgv from "./parseArgv";

const debug = makeDebug("grep-ast");

export default async function grepAst(
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

  const worker_ = new Worker(require.resolve("./worker"));
  const worker = worker_ as typeof worker_ & typeof import("./worker");

  worker.getStdout().pipe(process.stdout);
  worker.getStderr().pipe(process.stderr);
  await Promise.all(
    files.map(async (filepath: string) => {
      try {
        const resultsFromWorker = await worker.processFile(filepath, argv);
        results.push(...resultsFromWorker);
      } catch (err: unknown) {
        results.push({
          filepath,
          error: true,
          message:
            "Worker failed: " +
            (typeof err === "object" &&
            err != null &&
            "stack" in err &&
            typeof err.stack === "string"
              ? err.stack
              : err),
        });
      }
    })
  );
  worker.end();

  return results;
}
