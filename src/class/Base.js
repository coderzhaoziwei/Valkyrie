class Base {
  constructor(data) {
    this.id = data.id
    this.name = data.name
  }
  get nameText() {
    // 删除标签后的格式化文本
    return this.name.replace(/<\S+?>/g, ``)
  }
  get colorValue() {
    // 颜色 [1-7]
    const index = [ // 0: 无法判断
      /^<(hiw|wht)>/i, // 1: 白
      /^<hig>/i, // 2: 绿
      /^<hic>/i, // 3: 蓝
      /^<hiy>/i, // 4: 黄
      /^<hiz>/i, // 5: 紫
      /^<hio>/i, // 6: 橙
      /^<(hir|ord|red)>/i, // 7: 红
      /^<\S\S\S>/, // 8: 未知
    ].findIndex(regexp => regexp.test(this.name)) + 1

    // 打印未知标签
    if (index === 8) {
      console.warn(this.name)
    }

    return index
  }
}

export default Base
