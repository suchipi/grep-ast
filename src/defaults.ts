import type { Loc, Options } from "./types";
import * as ee from "equivalent-exchange";

export default {
  patterns: ["./**/*.[cm]?[jt]sx?"],
  gitignore: true,
  encoding: "utf-8" as const,
  parser: ee,
  parserOptions: {
    parseOptions: {
      skipRecast: true,
    },
  },
  getLoc: (node: ee.types.Node): Loc | null => node.loc ?? null,
} satisfies Partial<Options<ee.types.Node, ee.Options>>;
