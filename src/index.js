import Vue from "vue"
import Pinia from "pinia"
import App from "./component/App.vue"
// store
import { useSocketStore } from "./store/socket"
// html
import head from "./html/head.html"
import body from "./html/body.html"
// global
import { window, log, addClassName, updateToolBarPosition } from "./global"

const pinia = Pinia.createPinia()
const app = Vue.createApp(App)
app.use(pinia)
app.use(Element3)

// 初始化网络连接
const socket = useSocketStore()
socket.init()

// 页面加载完毕
document.addEventListener("DOMContentLoaded", function() {
  log("document.event: DOMContentLoaded")
  document.head.insertAdjacentHTML("beforeend", head)
  document.body.insertAdjacentHTML("beforeend", body)

  // document.body.className = "md:flex w-full" + document.body.className

  addClassName("body", "md:flex")

  // document.querySelector(".map-panel").remove()
  // document.querySelector(".room-title").remove()
  // document.querySelector(".room_desc").remove()

  app.mount("#app")
})

// 清除日志
window.console.log = () => {}

// 窗口尺寸变动时 触发工具栏位置变动
window.addEventListener("resize", () => {
  updateToolBarPosition()
})
