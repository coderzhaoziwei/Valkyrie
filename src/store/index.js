import { createStore } from "vuex"

import worker from "./modules/worker"
import emitter from "./modules/emitter"

import onlogin from "./modules/onlogin"
import onstate from "./modules/onstate"
import onscore from "./modules/onscore"
import onroom from "./modules/onroom"
import onitems from "./modules/onitems"

const store = createStore({
  state() {
    return {
      roles: {},
      id: undefined,
      state: "",
      score: {},
      room: {},
      items: [],
      npcs: [],
    }
  },
  mutations: {
    updateRole: (state, data) => {
      // 加载
      state.roles = JSON.parse(localStorage.getItem("roles") || "{}")
      const id = data.id
      state.roles[id] = Object.assign(state.roles[id] || {}, data)
      // 保存
      localStorage.setItem("roles", JSON.stringify(state.roles))
    },
    updateId(state, data) {
      state.id = data
      unsafeWindow.id = data // 全局标识
    },
    updateState: (state, data) => (state.state = data),
    updateScore: (state, data) => Object.assign(state.score, data),
    updateRoom: (state, data) => Object.assign(state.room, data),
    updateItems(state, data) {
      state.items.splice(0)
      state.items.push(...data)
      state.npcs.splice(0)
      state.npcs.push(...data.filter(item => item.isNpc))
    },
  },
  actions: {
    async wait(context, ms) {
      return new Promise(resolve => setTimeout(() => resolve(), ms))
    },
    setCookie(context, { name, value }) {
      document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
    },
    getCookie(context, name) {
      const cookies = document.cookie.split(";").reduce((cookies, cookieString) => {
        const i = cookieString.indexOf("=")
        const name = cookieString.substr(0, i).trim()
        const value = cookieString.substr(i + 1)
        cookies[name] = value
        return cookies
      }, {})
      return cookies[name]
    },
  },
  modules: {
    worker,
    emitter,

    onlogin,
    onroom,
    onitems,
    onstate,
    onscore,
  },
})

export default store
