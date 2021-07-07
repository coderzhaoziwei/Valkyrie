import vue from "rollup-plugin-vue"
import cleanup from "rollup-plugin-cleanup"
import clear from "rollup-plugin-clear"
import commonjs from "@rollup/plugin-commonjs"

import { sourcemap, banner, globals, external } from "./config.js"

export default {
  input: "src/main.js",
  output: [
    { format: "cjs", file: "dist/valkyrie.cjs.js", sourcemap },
    { format: "esm", file: "dist/valkyrie.esm.js", sourcemap },
    { format: "umd", file: "dist/valkyrie.global.js", sourcemap, globals },
    { format: "iife", file: "dist/valkyrie.user.js", sourcemap, globals, banner },
  ],
  plugins: [
    vue(),
    cleanup(),
    commonjs(),
    clear({ targets: ["dist"] }),
  ],
  external,
}
