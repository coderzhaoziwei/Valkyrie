import Role from "../../../class/Role"

const initItemsHandler = ({ state, commit, dispatch }) => {
  // items
  valkyrie.on("items", data => {
    if (Array.isArray(data.items)) {
      commit("clear")
      data.items.forEach(item => {
        if (item) commit("add", new Role(item))
      })
      commit("sort")
      // 修改数据
      data.items = state.list
    }
  })
  // itemadd
  valkyrie.on("itemadd", data => {
    commit("add", new Role(data))
    commit("sort")
    // 修改数据
    Object.keys(data).forEach(key => delete data[key])
    data.type = "items"
    data.items = state.list
  })
  // itemremove
  valkyrie.on("itemremove", data => commit("remove", data.id))
  // sc
  valkyrie.on("sc", data => commit("update", data))
}

export default {
  namespaced: true,
  state: { list: [] },
  mutations: {
    clear: state => state.list.splice(0),
    add: (state, role) => {
      const index = state.list.findIndex(item => item.id === role.id)
      if (index !== -1) {
        state.list.splice(index, 1, role)
      } else {
        state.list.push(role)
      }
    },
    sort: state => state.list.sort((a, b) => a.sortValue - b.sortValue),
    remove: (state, id) => {
      const index = state.list.findIndex(item => item.id === id)
      if (index !== -1) state.list.splice(index, 1)
    },
    // 更新数值 尚待优化
    update: (state, data) => {
      const index = state.list.findIndex(item => item.id === data.id)
      if (index === -1) return
      if (valkyrie.hasOwn(data, "hp")) state.list[index].hp = Number(data.hp)
      if (valkyrie.hasOwn(data, "mp")) state.list[index].mp = Number(data.mp)
      if (valkyrie.hasOwn(data, "max_hp")) state.list[index].max_hp = Number(data.max_hp)
      if (valkyrie.hasOwn(data, "max_mp")) state.list[index].max_mp = Number(data.max_mp)
    },
  },
  actions: {
    init: { root: true, handler: initItemsHandler },
  },
}
