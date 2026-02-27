export type Argv = Partial<{
  selector: string;
  patterns: string;
  ignore: string;
  gitignore: boolean;
  encoding: string;
  parser: string;
  parserOptions: string;
  getLoc: string;
  _: [string];
}>;

export type Options = Partial<{
  selector: string;
  patterns: Array<string>;
  gitignore: boolean;
  encoding: string;
  parser: {
    parse: (code: string, options: {}) => {};
  };
  parserOptions: {};
  getLoc: (node: {}) => Loc;
}>;

export type Loc = {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
};

export type Result =
  | {
      filepath: string;
      error: true;
      message: string;
    }
  | {
      filepath: string;
      error: false;
      message: string;
      loc: Loc;
      contents: string;
    };
