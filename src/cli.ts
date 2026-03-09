#!/usr/bin/env node
import type { Result } from "./types";
import kleur from "kleur";
import * as babelCodeFrame from "@babel/code-frame";
import ora from "ora";
import { runMain } from "@suchipi/run-main";
import grepAst from "./index";
import readArgv from "./readArgv";
import parseArgv from "./parseArgv";
import defaults from "./defaults";

async function main() {
  const argv = readArgv();
  const options = parseArgv(argv);

  const patternsSpinner = ora(
    kleur.blue(
      `Matching patterns: ${JSON.stringify(
        options.patterns || defaults.patterns
      )}`
    ) +
      kleur.grey(
        ` (gitignore: ${
          options.gitignore || defaults.gitignore ? "enabled" : "disabled"
        })`
      )
  );
  patternsSpinner.start();
  const filesSpinner = ora();

  const results: Array<Result> = await grepAst(argv, (files: Array<string>) => {
    patternsSpinner.succeed(kleur.green(`Found ${files.length} files.`));
    filesSpinner.start(kleur.blue("Parsing files..."));
  });
  filesSpinner.succeed(kleur.green("Parsed files."));

  process.stderr.write("\n" + kleur.blue("Results:") + "\n");
  results.forEach((result) => {
    if (result.error) {
      process.stderr.write(kleur.red(result.message) + "\n");
      process.exitCode = 1;
    } else {
      const codeFrame = babelCodeFrame.codeFrameColumns(
        result.contents,
        {
          start: {
            line: result.loc.start.line,
            column: result.loc.start.column + 1,
          },
          end: {
            line: result.loc.end.line,
            column: result.loc.end.column + 1,
          },
        },
        {
          highlightCode: true,
          message: result.message,
        }
      );
      process.stderr.write(
        result.filepath +
          kleur.grey(
            `:${result.loc.start.line}:${result.loc.start.column}-${result.loc.end.line}:${result.loc.end.column}`
          ) +
          "\n"
      );
      process.stderr.write(codeFrame + "\n");
      process.stderr.write("\n");
    }
  });

  const nonErrorResults = results.filter((result) => !result.error);
  process.stderr.write(
    "\n" + kleur.blue(`${nonErrorResults.length} total matches:`) + "\n"
  );
  nonErrorResults.forEach((result) => {
    process.stdout.write(
      result.filepath +
        kleur.grey(
          `:${result.loc.start.line}:${result.loc.start.column}-${result.loc.end.line}:${result.loc.end.column}`
        ) +
        "\n"
    );
  });
}

runMain(main);
