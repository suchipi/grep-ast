export type Argv = Partial<{
  selector: string;
  patterns: string;
  ignore: string;
  gitignore: boolean;
  encoding: string;
  parser: string;
  parserOptions: string;
  getLoc: string;
  _: Array<string>;
}>;

export type Options<NodeType = any, ParserOptionsType = any> = {
  selector: string;
  patterns: Array<string>;
  gitignore: boolean;
  encoding: NodeJS.BufferEncoding;
  parser: {
    parse: (code: string, options: ParserOptionsType) => {};
  };
  parserOptions: ParserOptionsType;
  getLoc: (node: NodeType) => Loc | undefined | null;
};

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
      loc: Loc | null | undefined;
      contents: string;
    };
