import content from "../../store/socket_worker_content.js"

export default {
  namespaced: true,
  state: {
    // 指令历史记录
    commandList: [],
    commandLast: "",
    // 文本消息记录
    textList: [],
    textList: [],
  },
}
