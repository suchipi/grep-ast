#!/usr/bin/env node
import type { Result } from "./types";
import chalk from "chalk";
import babelCodeFrame from "@babel/code-frame";
import ora from "ora";
import grepAst from "./index";
import readArgv from "./readArgv";
import parseArgv from "./parseArgv";
import defaults from "./defaults";

(async function main() {
  try {
    const argv = readArgv();
    const options = parseArgv(argv);

    const patternsSpinner = ora(
      chalk.blue(
        `Matching patterns: ${JSON.stringify(
          options.patterns || defaults.patterns
        )}`
      ) +
        chalk.grey(
          ` (gitignore: ${
            options.gitignore || defaults.gitignore ? "enabled" : "disabled"
          })`
        )
    );
    patternsSpinner.start();
    const filesSpinner = ora();

    const results: Array<Result> = await grepAst(
      argv,
      (files: Array<string>) => {
        patternsSpinner.succeed(chalk.green(`Found ${files.length} files.`));
        filesSpinner.start(chalk.blue("Parsing files..."));
      }
    );
    filesSpinner.succeed(chalk.green("Parsed files."));

    process.stderr.write("\n" + chalk.blue("Results:") + "\n");
    results.forEach((result) => {
      if (result.error) {
        process.stderr.write(chalk.red(result.message) + "\n");
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
            chalk.grey(
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
      "\n" + chalk.blue(`${nonErrorResults.length} total matches:`) + "\n"
    );
    nonErrorResults.forEach((result) => {
      if (result.error) return; // for type narrowing
      process.stdout.write(
        result.filepath +
          chalk.grey(
            `:${result.loc.start.line}:${result.loc.start.column}-${result.loc.end.line}:${result.loc.end.column}`
          ) +
          "\n"
      );
    });
  } catch (error) {
    process.stderr.write(chalk.red(error) + "\n");
    if (
      typeof error === "object" &&
      error != null &&
      "stack" in error &&
      typeof error.stack === "string"
    ) {
      process.stderr.write(chalk.red(error.stack) + "\n");
    }
    process.exit(1);
  }
})();
