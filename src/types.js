/* @flow */
export type Argv = $Shape<{
  selector: string,
  patterns: string,
  ignore: string,
  gitignore: boolean,
  encoding: string,
  parser: string,
  parserOptions: string,
  getLoc: string,
  _: [string],
}>;

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

export type Result =
  | {
      filepath: string,
      error: true,
      message: string,
    }
  | {
      filepath: string,
      error: false,
      message: string,
      loc: Loc,
      contents: string,
    };
