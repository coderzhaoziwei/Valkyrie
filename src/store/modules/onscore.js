export default {
  actions: {
    init({ rootState, commit, dispatch }) {
      const handler = async data => {
        if (data.id !== rootState.id) return
        commit("updateScore", data)
      }
      dispatch("on", { type: "sc", handler })
      dispatch("on", { type: "score", handler })
    },
  },
}
