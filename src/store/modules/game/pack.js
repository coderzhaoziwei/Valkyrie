import Pack from "../../../class/Pack"

export default {
  namespaced: true,
  state: {
    eqs: [],
    packs: [],
    money: 0,
    limit: 0,
  },
  getters: {
    count(state) {
      return state.packs.length
    },
  },
  mutations: {
    updateEqs(state, eqs) {
      Object.assign(state.eqs, eqs)
    },
    updatePacks(state, packs) {
      state.packs.splice(0)
      state.packs.push(...packs)
    },
    updateMoney(state, money) {
      state.money = money
    },
    updateLimit(state, limit) {
      state.limit = limit
    },
  },
  actions: {
    init: {
      root: true,
      handler({ state, getters, commit }) {
        valkyrie.on("pack", data => {
          const hasOwn = valkyrie.hasOwn
          // eqs
          if (hasOwn(data, "eqs") && Array.isArray(data.eqs)) {
            const eqs = []
            data.eqs.forEach((eq, index) => (eqs[index] = eq))
            commit("updateEqs", eqs)
          }
          // packs
          if (hasOwn(data, "items") && Array.isArray(data.items)) {
            const packs = []
            data.items.forEach(item => packs.push(new Pack(item)))
            packs.sort((a, b) => a.sortValue - b.sortValue)
            commit("updatePacks", packs)
            // 修改数据
            data.items = packs
          }
          // money
          if (hasOwn(data, "money")) {
            commit("updateMoney", Number(data.money) || 0)
          }
          // 物品上限
          if (hasOwn(data, "max_item_count")) {
            commit("updateLimit", Number(data.max_item_count) || 0)
            // 当物品上限不足时，自动取背包物品的数量值。
            data.max_item_count = Math.max(state.limit, getters.count)
          }
        })
      },
    },
  },
}
