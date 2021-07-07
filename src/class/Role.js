import Base from "./Base"

class Role extends Base {
  constructor(data) {
    super(data)
    this.hp = data.hp || 0
    this.mp = data.mp || 0
    this.max_hp = data.max_hp || 0
    this.max_mp = data.max_mp || 0
    this.status = data.status || []
    // 1: 玩家对象, 0: ？
    this.p = data.p || 0
  }
  get isSelf() {
    // 是否玩家自己
    return this.id === unsafeWindow.id
  }
  get isPlayer() {
    // 是否玩家
    return this.p === 1
  }
  get isOffline() {
    // 是否掉线的玩家
    return this.name.includes(`<red>&lt;断线中&gt;</red>`)
  }
  get isNpc() {
    // 是否NPC
    return !this.isPlayer
  }
  get sortValue() {
    // 排序权重
    if (this.isSelf) return 0
    if (this.isNpc) return this.colorValue
    return this.colorValue + (this.isOffline ? 2000 : 1000)
  }
}

export default Role
