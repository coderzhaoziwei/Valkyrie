import Vue from "vue"
import store from "./store"
import head from "./html/head.html"
import body from "./html/body.html"
import App from "./components/App.vue"

unsafeWindow.valkyrie = { store }
unsafeWindow.valkyrie.version = GM_info.script.version
unsafeWindow.valkyrie.dev = GM_info.script.version.includes("dev")
unsafeWindow.valkyrie.log = (...args) => {
  if (unsafeWindow.valkyrie.dev === true) {
    GM_log(...args)
  }
}
unsafeWindow.valkyrie.on = (type, handler) => {
  store.dispatch("on", { type, handler })
}
unsafeWindow.valkyrie.send = (...args) => {
  store.dispatch("sendCommands", args)
}
unsafeWindow.valkyrie.text = text => {
  store.dispatch("ontext", text)
}
unsafeWindow.valkyrie.data = data => {
  store.dispatch("ondata", data)
}

unsafeWindow.valkyrie.sleep = ms => {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}
unsafeWindow.valkyrie.hasOwn = (obj, prop) => {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
unsafeWindow.valkyrie.setCookie = (name, value) => {
  document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
}
unsafeWindow.valkyrie.getCookie = (name) => {
  const cookies = document.cookie.split(";").reduce((cookies, cookieString) => {
    const i = cookieString.indexOf("=")
    const name = cookieString.substr(0, i).trim()
    const value = cookieString.substr(i + 1)
    cookies[name] = value
    return cookies
  }, {})
  return cookies[name]
}

// 工具栏位置变动
unsafeWindow.valkyrie.updateToolBarPosition = () => {
  if (document.querySelector(".content-bottom").offsetHeight === 0) {
    document.querySelector("[command=showcombat]").click()
  }
  if (document.querySelector(".right-bar").offsetWidth === 0) {
    document.querySelector("[command=showtool]").click()
  }

  clearTimeout(unsafeWindow.valkyrie.updateToolBarPositionId)
  unsafeWindow.valkyrie.updateToolBarPositionId = setTimeout(() => {
    const h1 = document.querySelector(".content-bottom").clientHeight
    const h2 = document.querySelector(".tool-bar.bottom-bar").clientHeight
    document.querySelector(".right-bar").style.bottom = h1 + h2 + "px"
  }, 1000)
}

// 窗口尺寸变动时 触发工具栏位置变动
unsafeWindow.addEventListener("resize", () => {
  unsafeWindow.valkyrie.updateToolBarPosition()
})

// 数据初始化
store.dispatch("init")

// 页面加载完毕
document.addEventListener("DOMContentLoaded", function() {
  valkyrie.log("document.event: DOMContentLoaded")
  document.head.insertAdjacentHTML("afterbegin", head)
  document.body.insertAdjacentHTML("afterbegin", body)

  // document.querySelector(".map-panel").remove()
  // document.querySelector(".room-title").remove()
  // document.querySelector(".room_desc").remove()

  const app = Vue.createApp(App)
  app.use(store)
  app.use(Element3)
  app.mount("#app")
})

unsafeWindow.console.log = () => {}
