import process from "process"
import vue from "rollup-plugin-vue"
import cleanup from "rollup-plugin-cleanup"
import commonjs from "@rollup/plugin-commonjs"
import { string } from "rollup-plugin-string"

import { sourcemap, banner, globals, external } from "./config.js"

const tag = process.env.NODE_ENV === "production" ? "prod" : "dev"

export default {
  input: "src/main.js",
  output: [
    { format: "cjs", file: "dist/valkyrie.cjs.js", sourcemap },
    { format: "esm", file: "dist/valkyrie.esm.js", sourcemap },
    { format: "umd", file: "dist/valkyrie.global.js", sourcemap, globals },
    { format: "iife", file: `dist/valkyrie.${ tag }.user.js`, globals, banner },
  ],
  plugins: [
    vue(),
    cleanup(),
    commonjs(),
    string({
      include: [
        "src/html/*.html",
        "src/store/modules/worker/content.js",
      ],
    }),
  ],
  external,
}
