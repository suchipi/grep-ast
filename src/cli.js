#!/usr/bin/env node
/* @flow */
const chalk = require("chalk");

(async function main() {
  try {
    const babelCodeFrame = require("@babel/code-frame");
    const ora = require("ora");
    const grepAst = require("./index");
    const readArgv = require("./readArgv");
    const defaults = require("./defaults");

    const options = readArgv();

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

    const results = await grepAst(options, (files) => {
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
    process.exit(1);
  }
})();
