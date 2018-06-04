#!/usr/bin/env node
/* @flow */
const chalk = require("chalk");

(async function main() {
  try {
    const babelCodeFrame = require("@babel/code-frame");
    const astGrep = require("./index");
    const readArgv = require("./readArgv");

    const options = readArgv();
    const results = await astGrep(options);
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
        process.stdout.write(
          `${result.filepath}: ${result.loc.start.line}:${
            result.loc.start.column
          }-${result.loc.end.line}:${result.loc.end.column}\n`
        );
        process.stderr.write(codeFrame + "\n");
        process.stdout.write("\n");
      }
    });
  } catch (error) {
    process.stderr.write(chalk.red(error) + "\n");
    process.exit(1);
  }
})();
