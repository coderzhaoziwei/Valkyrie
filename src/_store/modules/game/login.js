export default {
  namespaced: true,
  state: {
    id: "",
    roles: {},
  },
  mutations: {
    updateId(state, value) {
      state.id = value
      unsafeWindow.valkyrie.id = value // 全局标识
    },
    updateRole(state, value) {
      // 加载
      const roles = JSON.parse(localStorage.getItem("roles") || "{}")
      Object.assign(state.roles, roles)

      const id = value.id
      if (state.roles[id] === undefined) state.roles[id] = {}
      Object.assign(state.roles[id], value)
      // 保存
      localStorage.setItem("roles", JSON.stringify(state.roles))
    },
  },
  actions: {
    init: {
      root: true,
      handler({ dispatch }) {
        dispatch("onroles")
        dispatch("onlogin")
      },
    },
    // onroles({ commit }) {
    //   valkyrie.on("roles", data => {
    //     if (Array.isArray(data.roles) === false) return
    //     data.roles.forEach(role => commit("updateRole", role))
    //   })
    // },
    onlogin({ state, commit }) {

      valkyrie.on("login", async () => {
        valkyrie.send("pack,score2,score")
        await valkyrie.sleep(1000)
        document.querySelector("[command=skills]").click()
        await valkyrie.sleep(1000)
        document.querySelector("[command=tasks]").click()
        await valkyrie.sleep(1000)
        document.querySelector(".dialog-close").click()
        valkyrie.updateToolBarPosition()
      })
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
