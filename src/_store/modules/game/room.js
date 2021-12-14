
export default {
  namespaced: true,
  state: {
    name: "",
    path: "",
    desc: "",
    cmds: [],
    x: "",
    y: "",
    exits: [],
  },
  actions: {
    init: {
      root: true,
      handler({ dispatch }) {
        dispatch("onroom")
        dispatch("onexits")
      },
    },
    onroom({ state }) {
      valkyrie.on("room", data => {
        state.name = data.name
        state.path = data.path
        state.desc = data.desc
        const names = state.name.split(/-|\(|\)/)
        state.x = names[0]
        state.y = names[1]

        state.cmds.splice(0)
        state.cmds.push(...data.commands)
      })
    },
    // { type: "exits", items: { east: "东大街", north: "北大街", south: "南大街", west: "西大街" } }
    onexits({ state }) {
      valkyrie.on("exits", data => {
        state.exits.splice(0)
        Object.keys(data.items).forEach(x => {
          const name = data.items[x]
          const command = `go ${x}`
          state.exits.push({ name, command })
        })
      })
    },
  },
}
