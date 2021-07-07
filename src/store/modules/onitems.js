import Role from "../../class/Role"

const onItems = ({ state, getters, commit, dispatch, rootState }) => {
  const type = "items"
  const handler = data => {
    console.log(data)
    if (Array.isArray(data.items) === false) return
    const items = []
    data.items.forEach(data => data && items.push(new Role(data)))
    items.sort((a, b) => a.sortValue - b.sortValue)
    data.items = items
    commit("updateItems", items)
  }
  dispatch("on", { type, handler })
}

const onItemAdd = ({ state, getters, commit, dispatch, rootState }) => {
  const type = "itemadd"
  const handler = data => {
    const role = new Role(data)
    const items = rootState.items.slice(0)
    const index = items.findIndex(item => item.id === role.id)
    if (index !== -1) {
      items.splice(index, 1, role)
    } else {
      items.push(role)
    }
    items.sort((a, b) => a.sortValue - b.sortValue)
    commit("updateItems", items)

    data.type = "items"
    data.items = items
  }
  dispatch("on", { type, handler })
}

const onItemRemove = ({ state, getters, commit, dispatch, rootState }) => {
  const type = "itemremove"
  const handler = data => {
    const items = rootState.items.slice(0)
    const index = items.findIndex(item => item.id === data.id)
    if (index !== -1) items.splice(index, 1)
    commit("updateItems", items)
  }
  dispatch("on", { type, handler })
}

const onSc = ({ state, getters, commit, dispatch, rootState }) => {
  const type = "sc"
  const handler = data => {
    const items = rootState.items.slice(0)
    const index = items.findIndex(item => item.id === data.id)
    if (index === -1) return

    const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    if (hasOwn(data, "hp")) items[index].hp = Number(data.hp)
    if (hasOwn(data, "mp")) items[index].mp = Number(data.mp)
    if (hasOwn(data, "max_hp")) items[index].max_hp = Number(data.max_hp)
    if (hasOwn(data, "max_mp")) items[index].max_mp = Number(data.max_mp)

    commit("updateItems", items)
  }
  dispatch("on", { type, handler })
}

export default {
  actions: {
    init(context) {
      console.log("onitems.js")
      onItems(context)
      onItemAdd(context)
      onItemRemove(context)
      onSc(context)
    },
  },
}
