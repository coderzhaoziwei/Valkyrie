const initScoreHandler = ({ commit }) => {
  const handler = data => {
    if (data.id === unsafeWindow.valkyrie.id) commit("update", data)
  }
  valkyrie.on("score", handler)
  valkyrie.on("sc", handler)
}

export default {
  namespaced: true,
  state: {
    data: {},
  },
  mutations: {
    update(state, data) {
      Object.assign(state.data, data)
    },
  },
  actions: {
    init: { root: true, handler: initScoreHandler },
  },
}
