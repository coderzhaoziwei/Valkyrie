import Base from "./Base"
import PACK_LIST from "../data/PACK_LIST.json"

class Pack extends Base {
  constructor(data) {
    super(data)
    this.count = data.count
    this.unit = data.unit
    this.value = data.value || 0
    // 可装备: 0/1
    this.can_eq = data.can_eq || 0
    // 可使用: 0/1
    this.can_use = data.can_use || 0
    // 可学习: 0/1
    this.can_study = data.can_study || 0
    // 可合成: 0/1
    this.can_combine = data.can_combine || 0
  }
  get isEquip() {
    return this.can_eq === 1
  }
  get sortValue() {
    const index = PACK_LIST.findIndex(x => {
      const regexp = new RegExp(x, `i`)
      return regexp.test(this.name)
    }) + 1
    return this.colorValue + (index * 10)
  }
  get valueText() {
    // 物品价值文本
    return this.value
  }
}

export default Pack
