import { defineStore } from "pinia"

export const useEmitterStore = defineStore({
  id: "emitter",
  state() {
    return {
      id: 0,
      // { type: [ handlerId_1, handlerId_2, handlerId_3, ... ], ... }
      types: {},
      // { handlerId: { type, typeIndex, handler, handlerId }, ... }
      handlers: {},
    }
  },
  actions: {
    emit({ type, data }) {
      const ids = this.types[type]
      if (Array.isArray(ids) === false) return
      ids.forEach(id => {
        if (id === undefined) return
        const { handler, handlerId } = this.handlers[id]
        if (typeof handler === "function") {
          handler(data, () => this.remove(handlerId)) // 第二个参数为注销自身的方法
        }
      })
    },
    on(type, handler) {
      this.add(type, handler)
      return () => this.remove(this.id) // 返回一个注销自身的方法
    },
    add(type, handler) {
      const handlerId = (this.id ++)
      if (Array.isArray(this.types[type]) === false) {
        this.types[type] = []
      }
      const typeIndex = this.types[type].length
      this.types[type].push(handlerId)
      this.handlers[handlerId] = { type, typeIndex, handler, handlerId }
    },
    remove(id) {
      const { type, typeIndex, handler, handlerId } = this.handlers[id]
      delete this.handlers[handlerId]
      delete this.types[type][typeIndex]
    },
  },
})
