const initTextHandler = ({ state, commit, dispatch, rootGetters }) => {
  valkyrie.on("text", data => {
    // 屏蔽提示 技能等级提升
    if (/^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/.test(data.text)) {
      delete data.type
      delete data.text
    }
    // 删除标签 获得经验潜能
    if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
      // <hig>你获得了43点经验，43点潜能。</hig>
      data.text = data.text.replace(/<\S+?>/g, "")
    }
    // 更新数值 获得经验潜能
    if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
      const exp = Number(RegExp.$1) || 0
      const pot = Number(RegExp.$2) || 0
      valkyrie.data({
        type: "score",
        id: unsafeWindow.valkyrie.id,
        exp: rootGetters.jy + exp,
        pot: rootGetters.qn + pot,
      })
    }
  })
  valkyrie.on("text", data => {
    const { type, text } = data
    if (type === "text") {
      commit("add", text)
    }
  })
}

export default {
  namespaced: true,
  state: {
    list: [],
  },
  getters: {

  },
  mutations: {
    add(state, text) {
      state.list.push(text)
      state.list.splice(0, state.list.length - 256)
    },
  },
  actions: {
    init: { root: true, handler: initTextHandler },
  },
}
