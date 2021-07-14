export default {
  namespaced: true,
  state: {
    id: 0,
    types: {},    // type: [ handlerId_1, handlerId_2, handlerId_3, ... ]
    handlers: {}, // handlerId: { type, typeIndex, handler, handlerId }
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
    emit: {
      root: true,
      handler({ state, commit }, { type, data }) {
        const ids = state.types[type]
        if (Array.isArray(ids) === false) return
        ids.forEach(id => {
          if (id === undefined) return
          const { handler, handlerId } = state.handlers[id]
          if (typeof handler === "function") {
            handler(data, () => commit("deleteHandler", handlerId)) // 第二个参数为注销自身的方法
          }
        })
      },
    },
    on: {
      root: true,
      handler({ state, commit }, { type, handler }) {
        commit("addHandler", { type, handler })
        return () => commit("deleteHandler", state.id) // 返回一个注销自身的方法
      },
    },
  },
}
