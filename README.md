# grep-ast

CLI tool that searches your codebase for AST patterns using [esquery](https://github.com/estools/esquery).

## Usage

```sh
# For example, to find all `module.exports = `:
npx grep-ast 'AssignmentExpression > MemberExpression[object.name=module][property.name=exports]'
# Or to find all dynamic requires:
npx grep-ast 'CallExpression[callee.name=require]:not([arguments.0.type=StringLiteral])'
```

## CLI Options

```
Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --selector       CSS-like selector string to search AST for           [string]
  --patterns       Space-separated list of glob patterns matching which files to
                   look in. Defaults to './**/*.{js,jsx}'.              [string]
  --ignore         Comma-separated list of directories to ignore        [string]
  --gitignore      Whether to omit files listed in your .gitignore file(s).
                   Defaults to 'true'.                 [boolean] [default: true]
  --encoding       The encoding to read your files as. Defaults to 'utf-8'.
                                                                        [string]
  --parser         The name of a parser module to use to parse your files. It
                   should have a parse function on it. Defaults to
                   '@babel/parser'.                                     [string]
  --parserOptions  Options to pass to your parser's parse function, encoded as a
                   JSON string.                                         [string]
  --getLoc         Function that receives an AST node and returns an object
                   describing the node's location. Defaults to 'node =>
                   node.loc'.                                           [string]
```

## License

MIT