import { version as piniaVersion } from "pinia/package.json"
import { version as vueVersion } from "vue/package.json"

export const window = unsafeWindow

export const version = {
  vue: vueVersion,
  pinia: piniaVersion,
  valkyrie: GM_info.script.version,
}

export const isDev = GM_info.script.version.includes("dev")

export const log = (...args) => {
  if (isDev === true) {
    GM_log(...args)
  }
}

export const sleep = ms => {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

export const hasOwn = (object, prop) => {
  return Object.prototype.hasOwnProperty.call(object, prop)
}

// Cookie
export const setCookie = function(name, value) {
  document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
}
export const getCookie = function(name) {
  const cookies = document.cookie.split(";").reduce((cookies, cookieString) => {
    const index = cookieString.indexOf("=")
    const name = cookieString.substr(0, index).trim()
    const value = cookieString.substr(index + 1)
    cookies[name] = value
    return cookies
  }, {})
  return cookies[name]
}

// 工具栏位置变动
export const updateToolBarPosition = function() {
  if (document.querySelector(".content-bottom").offsetHeight === 0) {
    document.querySelector("[command=showcombat]").click()
  }
  if (document.querySelector(".right-bar").offsetWidth === 0) {
    document.querySelector("[command=showtool]").click()
  }

  clearTimeout(unsafeWindow.updateToolBarPositionId)
  unsafeWindow.updateToolBarPositionId = setTimeout(() => {
    const h1 = document.querySelector(".content-bottom").clientHeight
    const h2 = document.querySelector(".tool-bar.bottom-bar").clientHeight
    document.querySelector(".right-bar").style.bottom = h1 + h2 + "px"
  }, 1000)
}

export const addClassName = function(selector, className) {
  document.querySelectorAll(selector).forEach(element => {
    className.split(" ").forEach(name => {
      if (name) {
        element.classList.add(name)
      }
    })
  })
}
