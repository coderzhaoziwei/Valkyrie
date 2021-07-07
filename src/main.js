import { createApp } from "vue"
import App from "./App.vue"

import store from "./store"

const app = createApp(App)
app.use(store)

// DOM 加载完毕
document.addEventListener("DOMContentLoaded", function() {

  // document.head.insertAdjacentHTML(`beforeend`, HeadHTML)
  // css
  // document.head.insertAdjacentHTML(`beforeend`, `<style>${ValkyrieStyle}</style>`)
  // body
  document.body.insertAdjacentHTML(`beforeend`, `<div id="app"></div>`)
  // room
  // document.querySelector(`.map-panel`).remove()
  // document.querySelector(`.room-title`).remove()
  // document.querySelector(`.room_desc`).remove()
  // document.querySelector(`.content-room`).insertAdjacentHTML(`afterbegin`, `<div id="app-room"></div>`)
  // 挂载 Valkyrie
  unsafeWindow.Valkyrie = app.mount(`#app`)
})


