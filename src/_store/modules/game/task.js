export default {
  namespaced: true,
  state: {
    smCount: 0,
    smTotal: 0,
    smTarget: "",
    ymCount: 0,
    ymTotal: 0,
    ymTarget: "",
    ymTargetX: "",
    ymTargetY: "",
    ybCount: 0,
    ybTotal: 0,
    fbCount: 0,
    wdCount: 0,
    wdTotal: 0,
    wdComplete: true,
    qaComplete: true,
    xyComplete: true,
    mpComplete: true,
  },
  getters: {

  },
  mutations: {
    update(state, value) {
      Object.assign(state, value)
    },
  },
  actions: {
    init: {
      root: true,
      handler({ commit }) {
        valkyrie.on("tasks", data => {
          if (Array.isArray(data.items) === false) return
          const task = {}
          data.items.forEach(item => {
            const { id, state, title, desc } = item
            switch (id) {
              case "sm":
                // 你的师门委托目前完成0/20个，共连续完成16个。
                if (/目前完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                  task.smCount = Number(RegExp.$1) || 0
                  task.smTotal = Number(RegExp.$2) || 0
                }
                // 你的师门委托你去寻找<wht>当归</wht>，你可以慢慢寻找，没有时间限制，目前完成0/20个，共连续完成16个。
                if (/你的师门委托你去寻找(\S+)，你可以慢慢寻找/.test(desc)) {
                  task.smTarget = RegExp.$1
                } else {
                  task.smTarget = ""
                }
                break
              case "yamen":
                // 扬州知府委托你追杀逃犯：目前完成0/20个，共连续完成34个。
                if (/目前完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                  task.ymCount = Number(RegExp.$1) || 0
                  task.ymTotal = Number(RegExp.$2) || 0
                }
                // 扬州知府委托你追杀逃犯：司空荔蓓，据说最近在峨眉派-走廊出现过，你还有9分57秒去寻找他，目前完成0/20个，共连续完成34个。
                if (/扬州知府委托你追杀逃犯：(\S+)，据说最近在(\S+)-(\S+)出现过/.test(desc)) {
                  task.ymTarget = RegExp.$1
                  task.ymTargetX = RegExp.$2
                  task.ymTargetY = RegExp.$3
                } else {
                  task.ymTarget = ""
                  task.ymTargetX = ""
                  task.ymTargetY = ""
                }
                break
              case "yunbiao":
                // 你目前没有接受到委托，本周完成0/20个，共连续完成0个。
                if (/本周完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                  task.ybCount = Number(RegExp.$1) || 0
                  task.ybTotal = Number(RegExp.$2) || 0
                }
                break
              case "signin":
                // 副本：<hik>0/20</hik>
                // 副本：<hig>20/20</hig>
                if (/副本：<[\S]{3}>(\d+)\/20<[\S]{4}>/.test(desc)) {
                  task.fbCount = Number(RegExp.$1) || 0
                }
                // <hig>武道塔可以重置，进度20/29</hig>，
                // <nor>武道塔已重置，进度99/99</nor>，
                if (/武道塔([\S]{1,2})重置，进度(\d+)\/(\d+)/.test(desc)) {
                  task.wdComplete = (RegExp.$1 === "已")
                  task.wdCount = Number(RegExp.$2) || 0
                  task.wdTotal = Number(RegExp.$3) || 0
                }
                // <hig>还没有给首席请安</hig>
                // 本周尚未协助襄阳守城，尚未挑战门派BOSS，还可以挑战武神BOSS5次。
                task.qaComplete = (/还没有给首席请安/.test(desc) === false)
                task.xyComplete = (/本周尚未协助襄阳守城/.test(desc) === false)
                task.mpComplete = (/尚未挑战门派BOSS/.test(desc) === false)
                // 每日签到
                if (state === 2) {
                  valkyrie.text(`<hig>﹝任务完成﹞</hig>${title}`)
                  valkyrie.send(`taskover ${id}`)
                }
                break
              default:
                if (state === 2) {
                  valkyrie.text(`<hig>﹝任务完成﹞</hig>${title}`)
                  // 2021 年五一节日礼包 (2021-05-01 ~ 2021-05-05)
                  if (id === "zz1" && title === "<hic>节日礼包</hic>"
                  && desc === "节日快乐，你尚未领取节日礼包。") {
                    valkyrie.send(`taskover ${id}`)
                  }
                }
                break
            }
          })
          commit("update", task)
        })
      },
    },
  },
}
