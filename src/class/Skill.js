import Base from "./Base"

class Skill extends Base {
  constructor(data) {
    super(data)
    this.level = Number(data.level) || 0
    this.can_enables = data.can_enables || undefined
    this.enable_skill = data.enable_skill || ``
    this.exp = 0
    this._exp = data.exp
  }
  set _exp(value) {
    value = Number(value) || 0
    // 计算后的熟练度数值为 [10, 95] 区间中 5 的倍数
    this.exp = (value <= 10) ? 10 : parseInt(value / 5) * 5
  }
  get _exp() {
    return this.exp
  }
  get k() {
    // 技能系数 = 技能颜色 * 2.5
    return this.colorValue * 2.5
  }
  get sortValue() {
    // 基础技能
    if (this.colorValue === 1) {
      return [
        `force`, // 1: 内功
        `unarmed`, // 2: 拳脚
        `dodge`, // 3: 轻功
        `parry`, // 4: 招架
        `blade`, // 5: 刀
        `sword`, // 6: 剑
        `club`, // 7: 棍
        `staff`, // 8: 杖
        `whip`, // 9: 鞭
        `throwing`, // 10: 暗器
        `bite`, // 11: 野兽扑咬
        `literate`, // 12: 读书识字
        `lianyao`, // 13: 炼药术
      ].findIndex(item => item === this.id) + 1
    }
    // 特殊技能 = 等级权重 + 颜色权重
    const levelSort = 100000 - this.level
    const colorSort = (10 - this.colorValue) / 2
    return levelSort + colorSort
  }
}

export default Skill
