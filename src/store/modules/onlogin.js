export default {
  actions: {
    init({ rootState, commit, dispatch }) {
      // roles
      dispatch("on", { type: "roles", handler(data) {
        if (Array.isArray(data.roles) === false) return
        data.roles.forEach(role => commit("updateRole", role))
        console.log(JSON.parse(JSON.stringify(rootState.roles)))
      } })
      // login
      dispatch("on", { type: "login", async handler(data) {
        const id = data.id
        const count = (rootState.roles[id].count || 0) + 1
        const cookies = {
          u: await dispatch("getCookie", "u"),
          p: await dispatch("getCookie", "p"),
          s: await dispatch("getCookie", "s"),
        }
        const token = cookies.u + " " + cookies.p
        const server = ["一区", "二区", "三区", "四区", "五区", "六区"][cookies.s]

        commit("updateRole", { id, count, cookies, token, server })
        commit("updateId", id)
      } })
      // login
      dispatch("on", { type: "login", async handler() {
        dispatch("sendCommands", "pack,score2,score")
        await dispatch("wait", 1000)
        document.querySelector("[command=skills]").click()
        await dispatch("wait", 1000)
        document.querySelector("[command=tasks]").click()
        await dispatch("wait", 1000)
        document.querySelector(".dialog-close").click()

        dispatch("updateToolBarPosition")
      } })
      // 窗口尺寸变动时 触发工具位置变动
      unsafeWindow.addEventListener("resize", () => dispatch("updateToolBarPosition"))
    },
    // 更新工具栏位置
    updateToolBarPosition() {
      if (document.querySelector(".content-bottom").offsetHeight === 0) {
        document.querySelector("[command=showcombat]").click()
      }
      if (document.querySelector(".right-bar").offsetWidth === 0) {
        document.querySelector("[command=showtool]").click()
      }
      setTimeout(() => {
        const h1 = document.querySelector(".content-bottom").clientHeight
        const h2 = document.querySelector(".tool-bar.bottom-bar").clientHeight
        document.querySelector(".right-bar").style.bottom = h1 + h2 + "px"
      }, 1000)
    },
  },
}

// this.on(`login`, function() {
//   if (this.id) {
//     const options = this.getValue(`options`)
//     Object.keys(options).forEach(key => {
//       this.options[key] = options[key]
//     })
//     // 默认关闭弹窗
//     this.options.showMapDialog = false
//     this.options.showTaskDialog = false
//     this.options.showChannelDialog = false
//     // 设置背景图
//     document.getElementById(`app`).style.backgroundImage = `url(${this.options.backgroundImage})`
//   }
