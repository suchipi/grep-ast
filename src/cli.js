#!/usr/bin/env node
/* @flow */
const chalk = require("chalk");
import type { Result } from "./types";

(async function main() {
  try {
    const babelCodeFrame = require("@babel/code-frame");
    const ora = require("ora");
    const grepAst = require("./index");
    const readArgv = require("./readArgv");
    const parseArgv = require("./parseArgv");
    const defaults = require("./defaults");

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

    const results: Array<Result> = await grepAst(argv, (files) => {
      patternsSpinner.succeed(chalk.green(`Found ${files.length} files.`));
      filesSpinner.start(chalk.blue("Parsing files..."));
    });
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
              `:${result.loc.start.line}:${result.loc.start.column}-${
                result.loc.end.line
              }:${result.loc.end.column}`
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
      if (result.error) return; // to make flow happy
      process.stdout.write(
        result.filepath +
          chalk.grey(
            `:${result.loc.start.line}:${result.loc.start.column}-${
              result.loc.end.line
            }:${result.loc.end.column}`
          ) +
          "\n"
      );
    });
  } catch (error) {
    process.stderr.write(chalk.red(error) + "\n");
    if (
      typeof error === "object" &&
      error != null &&
      typeof error.stack === "string"
    ) {
      process.stderr.write(chalk.red(error.stack) + "\n");
    }
    process.exit(1);
  }
})();
