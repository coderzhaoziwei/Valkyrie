import process from "process"
import vue from "rollup-plugin-vue"
import cleanup from "rollup-plugin-cleanup"
import commonjs from "@rollup/plugin-commonjs"
import { string } from "rollup-plugin-string"
import { banner, globals, external } from "./config.js"

export default {
  input: "src/main.js",
  output: [
    {
      format: "iife",
      file: `dist/valkyrie.${ process.env.NODE_ENV === "production" ? "prod" : "dev" }.user.js`,
      globals,
      banner,
    },
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
