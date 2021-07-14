import Base from "./Base"

const packs = [
  "神魂碎片",
  "<hio>武道残页</hio>",
  "<hio>武道</hio>",
  "帝魄碎片",
  "元晶",
  "玄晶",
  "周年庆徽章",
  "技能重置卡",
  "师门补给包",
  "背包扩充石",
  "随从礼包",
  "小箱子",
  "玫瑰花",
  "召唤令",
  "补签卡",
  "藏宝图",
  "鱼饵",
  "月饼",
  "朱果",
  "潜灵果",
  "顿悟丹",
  "养精丹",
  "闭元丹",
  "培元丹",
  "聚气丹",
  "突破丹",
  "冰心丹",
  "玄灵丹",
  "扫荡符",
  "天师符",
  "叛师符",
  "洗髓丹",
  "变性丹",
  "喜宴",
  "师门令牌",
  "挖矿指南",
  "铁镐",
  "钓鱼竿",
  "药王神篇",
  "红宝石",
  "绿宝石",
  "蓝宝石",
  "黄宝石",
  "碎裂的破军",
  "碎裂的贪狼",
  "碎裂的七杀",
  "碎裂的紫薇",
  "破军",
  "贪狼",
  "七杀",
  "紫薇",
  "进阶秘籍",
  "秘籍",
  "残页",
  "鲤鱼",
  "草鱼",
  "鲢鱼",
  "鲮鱼",
  "鳊鱼",
  "鲂鱼",
  "黄金鳉",
  "黄颡鱼",
  "太湖银鱼",
  "虹鳟",
  "孔雀鱼",
  "反天刀",
  "银龙鱼",
  "黑龙鱼",
  "罗汉鱼",
  "巨骨舌鱼",
  "七星刀鱼",
  "帝王老虎魟",
  "当归",
  "芦荟",
  "山楂叶",
  "柴胡",
  "金银花",
  "石楠叶",
  "茯苓",
  "沉香",
  "熟地黄",
  "九香虫",
  "络石藤",
  "冬虫夏草",
  "人参",
  "何首乌",
  "凌霄花",
  "灵芝",
  "天仙藤",
  "盘龙参",
  "四十二章经一",
  "四十二章经二",
  "四十二章经三",
  "四十二章经四",
  "四十二章经五",
  "四十二章经六",
  "四十二章经七",
  "四十二章经八",
  "★",
  "☆",
  ""
]

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
    const index = packs.findIndex(x => {
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
