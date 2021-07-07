class Emitter {
  constructor() {
    this.id = 0 // 累计 +1
    this.types = {} // { type1: [id1, id2, ...], ... }
    this.handlers = {} // { id1: { id1, type1, handler1 }, ... }
  }
  on(type, handler) {
    const id = ++ this.id

    if ((this.types[type] instanceof Array) === false) this.types[type] = []

    this.types[type].push(id)
    this.handlers[id] = { id, type, handler }

    // 返回一个注销自身的方法
    const off = () => this.off(id)
    return off
  }
  off(id) {
    const handler = this.handlers[id]
    delete this.handlers[id]

    const type = handler.type
    const index = this.types[type].findIndex(item => item === id)
    delete this.types[type][index]
  }
  emit(type, data) {
    const ids = this.types[type]
    // 检查
    if ((ids instanceof Array) === false || ids.length === 0) return
    // 遍历
    ids.forEach(id => {
      if (id === undefined) return
      const off = () => this.off(id) // 注销
      const { handler } = this.handlers[id]
      if (typeof handler === `function`) handler(data, off) // 第二个参数为注销自身的方法
    })
  }
}

export default Emitter
