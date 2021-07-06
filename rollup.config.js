import vue from "rollup-plugin-vue"
import cleanup from "rollup-plugin-cleanup"
import clear from "rollup-plugin-clear"

export default {
  input: "src/index.js",
  output: [
    {
      format: "iife",
      file: "dist/valkyrie.user.js",
      sourcemap: true,
      globals: { vue: "Vue" },
      // banner: tamperMonkeyMetaData,
    },
    {
      format: "esm",
      file: "dist/valkyrie.esm.js",
      sourcemap: true,
    },
    {
      format: "cjs",
      file: "dist/valkyrie.cjs.js",
      sourcemap: true,
    },
    {
      format: "umd",
      file: "dist/valkyrie.global.js",
      sourcemap: true,
      globals: { vue: "Vue" },
    },
  ],
  plugins: [
    vue(),
    clear({
      targets: ["dist"]
    }),
    cleanup(),
  ],
  external: ["vue"],
}
