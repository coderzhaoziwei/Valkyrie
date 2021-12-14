import { createStore } from "vuex"
import emitter from "./modules/emitter"
import socket from "./modules/socket"
import game from "./modules/game"

const store = createStore({
  getters: {
    // 角色列表
    roles(state) {
      return state.game.login.roles
    },
    id(state) {
      return state.game.score.data.id
    },
    // 标签
    tag(state) {
      return state.game.tag.value + state.game.tag.detail
    },
    // 页面标题
    documentTitle(state, getters) {
      const role = getters.roles[getters.id]
      if (role !== undefined) {
        return getters.tag + " " + role.name + " " + role.server
      }
      return "武神传说"
    },
    // 房间名称
    roomName(state) {
      return state.game.room.x + " " + state.game.room.y
    },
    // 经验
    jy(state) {
      return state.game.score.data.exp
    },
    // 潜能
    qn(state) {
      return state.game.score.data.pot
    },
    // 先天悟性
    wx1(state) {
      return Number(state.game.score.data.int) || 0
    },
    // 后天悟性
    wx2(state) {
      return Number(state.game.score.data.int_add) || 0
    },
    // 学习效率
    xxxl(state) {
      return Number(state.game.score.data.study_per ) || 0
    },
    // 练习效率
    lxxl(state) {
      return Number(state.game.score.data.lianxi_per) || 0
    },
    // 练习每一跳消耗＝(先天悟性＋后天悟性)×(1＋练习效率%－先天悟性%)
    lxCost(state, getters) {
      return Number((getters.wx1 + getters.wx2) * (1 + getters.lxxl / 100 - getters.wx1 / 100))
    },
    // 学习每一跳消耗＝(先天悟性＋后天悟性)×(1＋学习效率%－先天悟性%)×3
    xxCost(state, getters) {
      return Number((getters.wx1 + getters.wx2) * (1 + getters.xxxl / 100 - getters.wx1 / 100) * 3)
    },
    // items: state => state.game.items.list,
    // npcs: state => state.game.items.list.filter(item => item.isNpc),



    textList(state) {
      return state.game.text.list
    },
    chatList(state) {
      return state.game.chat.list
    },
  },
  modules: { emitter, socket, game },
})

export default store
