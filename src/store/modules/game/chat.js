import Chat from "../../../class/Chat"

const initChatHandler = ({ commit }) => {
  valkyrie.on("msg", data => commit("update", new Chat(data)))
}

export default {
  namespaced: true,
  state: { list: [] },
  mutations: {
    update(state, chat) {
      state.list.push(chat)
      state.list.slice(1000)
    },
  },
  actions: {
    init: { root: true, handler: initChatHandler },
  },
}

// channelList: [
//   { label: "世界", value: "chat" },
//   { label: "队伍", value: "tm" },
//   { label: "帮派", value: "pty" },
//   { label: "门派", value: "fam" },
//   { label: "全区", value: "es" },
// ],
// channel: "chat",
// content: "",

// updateChannel(state, channel) {
//   state.channel = channel
// },
// updateContent(state, content) {
//   state.content = content
// },

// send({ state, commit }) {
//   const channel = state.channel
//   const content = state.content.trim()
//   if (content) {
//     valkyrie.send(`${channel} ${content}`)
//   }
//   commit("updateContent", "")
// },
