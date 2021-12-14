import Skill from "../../../class/Skill"

const initSkillHandler = ({ state, commit, dispatch, rootState, rootGetters }) => {
  const hasOwn = valkyrie.hasOwn
  const isArray = Array.isArray
  valkyrie.on("skills", data => {
    // 技能列表
    if (hasOwn(data, "items") && isArray(data.items)) {
      const skills = []
      data.items.forEach(item => skills.push(new Skill(item)))
      skills.sort((a, b) => a.sortValue - b.sortValue)
      data.items = skills // 修改数据
      commit("updateSkills", skills)
    }
    // 技能等级上限
    if (hasOwn(data, "limit")) {
      commit("updateLimit", parseInt(data.limit) || 0)
    }
    // 学会新的技能
    if (hasOwn(data, "item")) {
      const skill = new Skill(data.item)
      commit("updateSkill", skill)
    }

    // 更新潜能值
    if (hasOwn(data, "pot")) {
      const id = unsafeWindow.valkyrie.id
      const pot = Number(data.pot) || 0
      valkyrie.data({ type: "score", id, pot })
    }

    // 指定技能
    const skill = state.skills.find(skill => skill.id === data.id)
    if (skill === undefined) return
    // 技能等级
    if (hasOwn(data, "level")) {
      skill.level = Number(data.level) || 1
      valkyrie.text(`你的技能${skill.name}提升到了<hiw>${skill.level}</hiw>级！`)
    }
    // 技能经验
    if (hasOwn(data, "exp")) {
      const id = unsafeWindow.valkyrie.id
      skill._exp = data.exp
      if (rootGetters.tag === "炼药") {
        valkyrie.text(`你获得了炼药经验，${skill.name}当前<hiw>${skill.level}</hiw>级。${data.exp}%`)
        return
      }

      if (rootGetters.tag === "练习" || rootGetters.tag === "学习") {
        valkyrie.data({ type: "state", state: rootGetters.tag, detail: skill.nameText })
      }
      if (rootGetters.tag.includes("练习")) {
        valkyrie.text(`你练习${ skill.name }消耗了${ rootGetters.lxCost }点潜能。${data.exp}%`)
        // 更新潜能
        valkyrie.data({ type: "score", id, pot: rootGetters.qn - rootGetters.lxCost })
      }
      if (rootGetters.tag.includes("学习")) {
        valkyrie.text(`你学习${ skill.name }消耗了${ rootGetters.xxCost }点潜能。${data.exp}%`)
        // 更新潜能
        valkyrie.data({ type: "score", id, pot: rootGetters.qn - rootGetters.xxCost })
      }
    }
  })
}

export default {
  namespaced: true,
  state: { skills: [], limit: 0 },
  mutations: {
    updateLimit(state, limit) {
      state.limit = limit
    },
    updateSkills(state, skills) {
      state.skills.splice(0)
      state.skills.push(...skills)
    },
    updateSkill(state, skill) {
      state.skills.push(skill)
    },
  },
  actions: {
    init: { root: true, handler: initSkillHandler },
  },
}

//   const skill = this.skillList[index]
//   /* 潜能消耗＝等级平方差×技能颜色系数 */
//   const qnCost = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * skill.k
//   /* 秒数消耗＝潜能/每一跳的潜能/(每分钟秒数/每分钟五次) */
//   const time = qnCost / this.lxCost / ( 60 / 5)
//   const timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time/60)}小时${parseInt(time%60)}分钟`
//   // 还需要${ timeString }消耗${ qn }点潜能到${ this.skillLimit }级。
// }
