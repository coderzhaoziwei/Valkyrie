import { name, version, author, description, homepage, icon, bugs, license } from "./package.json"
import process from "process"

export const globals = {
  vue: "Vue",
  vuex: "Vuex",
  pinia: "Pinia",
  element: "Element3",
  valkyrie: "valkyrie",
}
export const external = ["vue", "vuex", "pinia"]

const tempermonkey = `// ==UserScript==
// @name         ${ name }
// @namespace    ${ homepage }
// @version      ${ version }${ process.env.NODE_ENV === "development" ? ".dev" : "" }
// @author       ${ author }
// @description  ${ description }
// @homepage     ${ homepage }
// @icon         ${ icon }
// @supportURL   ${ bugs.url }
// @license      ${ license }
// @require      https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js
// @require      https://cdn.jsdelivr.net/npm/vuex@4/dist/vuex.global.js
// @require      https://cdn.jsdelivr.net/npm/pinia@next/dist/pinia.global.js
// @require      https://cdn.jsdelivr.net/npm/element3/dist/element3-ui.global.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.6.0/dist/gsap.min.js
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// ==/UserScript==

/* eslint-env: es6 */
/* eslint dot-notation: 0 */
`

export const banner = Object.values(globals).reduce((banner, global) => {
  return banner + `/* global ${global}: readonly */\n`
}, tempermonkey)
