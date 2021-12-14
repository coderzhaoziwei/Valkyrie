import { defineStore } from "pinia"
import { useEmitterStore } from "./emitter"
import { log, getCookie } from "../global"

export const useUserStore = defineStore({
  id: "user",
  state() {
    return {
      roles: {},
      id: "",
    }
  },
  actions: {
    init() {
      const emitter = useEmitterStore()
      // roles
      emitter.on("roles", data => {
        if (Array.isArray(data.roles)) {
          data.roles.forEach(item => this.updateRole(item))
          // 输出
          log(localStorage.getItem("roles"))
        }
      })
      // login
      emitter.on("login", data => {
        const id = data.id
        const count = (this.roles[id].count || 0) + 1
        const u = getCookie("u")
        const p = getCookie("p")
        const s = getCookie("s")
        const cookies = { u, p, s }
        const token = cookies.u + " " + cookies.p
        const server = ["一区", "二区", "三区", "四区", "五区", "六区"][cookies.s]
        this.updateRole({ id, count, cookies, token, server })
        // commit("updateId", id)
      })
    },
    updateRole(role) {
      // 加载
      const roles = JSON.parse(localStorage.getItem("roles") || "{}")
      Object.assign(this.roles, roles)
      // 更新
      const id = role.id
      if (this.roles[id] === undefined) this.roles[id] = {}
      Object.assign(this.roles[id], role)
      // 保存
      localStorage.setItem("roles", JSON.stringify(this.roles))
    },
  },
})
