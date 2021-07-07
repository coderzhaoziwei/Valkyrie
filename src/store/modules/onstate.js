export default {
  actions: {
    init({ commit, dispatch }) {
      console.log("actions => init => onstate.js")
      // 状态
      dispatch("on", {
        type: "state",
        handler(data) {
          const text = [
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
          ].find(text => (typeof data.state === "string") && data.state.includes(text))
          const state = text || data.state || ""

          data.state = state
          delete data.desc
          commit("updateState", state)
        },
      })
      // 战斗状态
      dispatch("on", {
        type: "combat",
        handler(data) {
          if (data.start === 1) commit("updateState", "战斗")
          else if (data.end === 1) commit("updateState", "")
        },
      })
      // 死亡状态
      dispatch("on", {
        type: "die",
        handler(data) {
          if (data.relive === true) commit("updateState", "")
          else commit("updateState", "死亡")
        },
      })
    },
  },
}
