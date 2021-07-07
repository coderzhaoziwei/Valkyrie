export default {
  namespaced: true,
  state() {
    return {
      id: 0,
      types: {},
      handlers: {},
    }
  },
  mutations: {
    addHandler(state, { type, handler }) {
      const handlerId = (++ state.id)
      if (Array.isArray(state.types[type]) === false) {
        state.types[type] = []
      }
      const typeIndex = state.types[type].length
      state.types[type].push(handlerId)
      state.handlers[handlerId] = { type, typeIndex, handler, handlerId }
    },
    deleteHandler(state, id) {
      const { type, typeIndex, handler, handlerId } = state.handlers[id]
      delete state.handlers[handlerId]
      delete state.types[type][typeIndex]
    },
  },
  actions: {
    emit({ state, commit }, { type, data }) {
      const ids = state.types[type]
      if (Array.isArray(ids) === false) return
      ids.forEach(id => {
        if (id === undefined) return
        const { handler, handlerId } = state.handlers[id]
        if (typeof handler === "function") {
          // 第二个参数为注销自身的方法
          handler(data, () => commit("deleteHandler", handlerId))
        }
      })
    },
    on({ state, commit }, { type, handler }) {
      commit("addHandler", { type, handler })
      // 返回一个注销自身的方法
      return () => commit("deleteHandler", state.id)
    },
  },
}
