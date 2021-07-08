import Vue from "vue"
import store from "./store"
import head from "./html/head.html"
import App from "./components/App.vue"

// 初始化 Worker
store.dispatch("init")

// 全局对象
unsafeWindow.Vue = Vue
unsafeWindow.Valkyrie = {
  store,
  debugMode: GM_info.script.version.includes("dev"),
}

// DOM 加载完毕
document.addEventListener("DOMContentLoaded", function() {
  GM_log("DOM content has loaded.")

  console.log("document.event: DOMContentLoaded")
  document.head.insertAdjacentHTML("beforeend", head)
  document.body.insertAdjacentHTML("beforeend", `<div id="app"></div>`)

  // document.head.insertAdjacentHTML(`beforeend`, HeadHTML)
  // document.head.insertAdjacentHTML(`beforeend`, `<style>${ValkyrieStyle}</style>`)
  // document.querySelector(`.map-panel`).remove()
  // document.querySelector(`.room-title`).remove()
  // document.querySelector(`.room_desc`).remove()

  const app = Vue.createApp(App)
  log("Install store (Vuex)")
  app.use(store)    // 安装 store 实例
  app.use(Element3) // 安装 Element3
  app.mount("#app") // 挂载
})

function log(...arg) {
  if (unsafeWindow.Valkyrie.debugMode === true) {
    GM_log(...arg)
  }
}

unsafeWindow.console.log = () => 0
