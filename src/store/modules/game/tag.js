const tags = [
  "打坐",
  "疗伤",
  "读书",
  "学习",
  "练习",
  "修炼",
  "工作",
  "挖矿",
  "采药",
  "钓鱼",
  "炼药",
  "闭关",
  "领悟",
  "聚魂",
  "推演",
]

const initTagHandler = ({ commit }) => {
  valkyrie.on("state", data => {
    const tag = tags.find(tag => {
      if (typeof data.state === "string") return data.state.includes(tag)
    })
    data.state = tag || data.state || ""
    delete data.desc
    commit("update", data.state)
  })
  valkyrie.on("combat", data => commit("update", data.start === 1 ? "战斗" : ""))
  valkyrie.on("die", data => commit("update", data.relive === true ? "" : "死亡"))
}

export default {
  namespaced: true,
  state: { value: "" },
  mutations: {
    update: (state, value) => (state.value = value),
  },
  actions: {
    init: { root: true, handler: initTagHandler },
  },
}
