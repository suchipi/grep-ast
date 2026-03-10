import type { Argv, Result } from "./types";
import makeDebug from "debug";
import globby from "globby";
import { runJobs, inChildProcess } from "parallel-park";
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

  const resultsByFile = await runJobs(
    files,
    async (filepath) => {
      try {
        const fileResults = await inChildProcess(
          { filepath, argv },
          ({ filepath, argv }) => {
            const worker = require("./worker") as typeof import("./worker");
            return worker.processFile(filepath, argv);
          }
        );
        return fileResults;
      } catch (err) {
        return [
          {
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
          } as const,
        ];
      }
    },
    {
      concurrency: 50,
    }
  );

  const results: Array<Result> = resultsByFile.flat(1);
  return results;
}
