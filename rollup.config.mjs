import typescriptPlugin from "rollup-plugin-typescript2";
import typescript from "typescript";
import filesize from "rollup-plugin-filesize";
import terser from "@rollup/plugin-terser";
import strip from "@rollup/plugin-strip";
import resolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

import os from "os";

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    external: [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies),
    ],
    plugins: [
      resolve(),
      strip(),
      commonJS({
        include: "node_modules/**",
      }),
      replace({
        "process.env.NODE_ENV": '"production"',
        preventAssignment: true,
      }),
      typescriptPlugin({
        typescript,
        clean: true,
        cacheRoot: os.tmpdir() + "/" + Date.now(),
      }),
      terser({
        compress: false,
        mangle: false,
        output: {
          beautify: true,
          comments: false,
        },
      }),

      filesize(),
    ],
  },
];
