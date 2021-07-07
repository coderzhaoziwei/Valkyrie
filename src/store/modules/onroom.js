const state = () => ({

})

const getters = {
  getter(state) {

  },
}

const mutations = {
  commit(state) {

  },
}

const actions = {
  init({ rootState, getters, commit, dispatch }) {
    dispatch("on", {
      type: "room",
      handler(data) {
        const { name, path, desc, cmds } = data
        const names = name.split(/-|\(|\)/)
        const x = names[0]
        const y = names[1]
        commit("updateRoom", { name, path, desc, cmds, x, y })
      },
    })
    //exits
    dispatch("on", {
      type: "exits",
      handler(data) {
        if (Array.isArray(data.items) === false) return
        const exits = []
        Object.keys(data.items).forEach(x => {
          const name = data.items[x]
          const command = `go ${x}`
          exits.push({ name, command })
        })
        commit("updateRoom", { exits })
      },
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
