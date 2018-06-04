/* @flow */
const globby = require("globby");
const babylon = require("@babel/parser");
const fs = require("fs");
const esquery = require("@suchipi/esquery").configure({
  getKeys(node) {
    return Object.keys(node);
  },
});
const pify = require("pify");
const fsp = pify(fs);

export type Loc = {
  start: {
    line: number,
    column: number,
  },
  end: {
    line: number,
    column: number,
  },
};

export type Options = $Shape<{
  selector: string,
  patterns: Array<string>,
  gitignore: boolean,
  encoding: string,
  parser: {
    parse: (code: string, options: Object) => Object,
  },
  parserOptions: Object,
  getLoc: (node: Object) => Loc,
}>;

export type Result = {
  filepath: string,
  node: Object,
  loc: Loc,
};

module.exports = async function astGrep({
  selector,
  patterns = ["**/*.js"],
  gitignore = true,
  encoding = "utf-8",
  parser = babylon,
  parserOptions = {
    allowImportExportEverywhere: true,
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    sourceType: "unambiguous",
    plugins: [
      "jsx",
      "flow",
      "flowComments",
      "doExpressions",
      "objectRestSpread",
      "decorators",
      "classProperties",
      "classPrivateProperties",
      "classPrivateMethods",
      "exportDefaultFrom",
      "exportNamespaceFrom",
      "asyncGenerators",
      "functionBind",
      "functionSent",
      "dynamicImport",
      "numericSeparator",
      "optionalChaining",
      "importMeta",
      "bigInt",
      "optionalCatchBinding",
      "throwExpressions",
      "pipelineOperator",
      "nullishCoalescingOperator",
    ],
  },
  getLoc = (node) => node.loc,
}: Options): Promise<Array<Result>> {
  const files = await globby(patterns, { gitignore });
  const results: Array<Result> = [];
  await Promise.all(
    files.map(async (file) => {
      const contents = await fsp.readFile(file, encoding);
      const ast = parser.parse(contents, parserOptions);
      const nodes = esquery.query(ast, selector);
      nodes.forEach((node) => {
        results.push({
          filepath: file,
          node: node,
          loc: getLoc(node),
        });
      });
    })
  );
  return results;
};
