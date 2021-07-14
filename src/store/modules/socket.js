import content from "../../worker/socket.js"

export default {
  namespaced: true,
  state: {
    // 运行 WebSocket 的子线程实例
    worker: null,
    // WebSocket 伪属性值
    readyState: 0,
    onopen: () => {},
    onclose: () => {},
    onerror: () => {},
    onmessage: () => {},
    // 指令历史记录
    commandList: [],
    commandLast: "",
  },
  mutations: {
    setReadyState(state, readyState) {
      state.readyState = readyState
    },
    onopen(state, fn) {
      state.onopen = fn
    },
    onclose(state, fn) {
      state.onclose = fn
    },
    onerror(state, fn) {
      state.onerror = fn
    },
    onmessage(state, fn) {
      state.onmessage = fn
    },
    oncommand(state, command) {
      state.commandLast = command
      state.commandList.push(command)
      state.commandList.slice(100)
    },
  },
  actions: {
    init: {
      root: true,
      handler({ state, commit, dispatch }) {
        const blob = new Blob([content])
        const url = URL.createObjectURL(blob)
        state.worker = new Worker(url)

        unsafeWindow.WebSocket = function(uri) {
          state.worker.postMessage({ type: "create", args: [uri] })
        }
        unsafeWindow.WebSocket.prototype = {
          set onopen(fn) {
            commit("onopen", fn)
          },
          set onclose(fn) {
            commit("onclose", fn)
          },
          set onerror(fn) {
            commit("onerror", fn)
          },
          set onmessage(fn) {
            commit("onmessage", fn)
          },
          get readyState() {
            return state.readyState
          },
          send(command) {
            valkyrie.send(command)
          },
        }
        state.worker.onmessage = event => {
          const data = event.data
          const { type } = data
          if (typeof type !== "string") {
            console.error(new TypeError("type is not string"))
          } else if (type === "readyState") {
            const { readyState } = data
            commit("setReadyState", readyState)
          } else if (type === "onopen") {
            state.onopen()
          } else if (type === "onclose") {
            state.onclose()
          } else if (type === "onerror") {
            state.onerror()
          } else if (type === "onmessage") {
            const e = event.data.event
            const data = (typeof e.data === "string" && e.data[0] === "{")
              ? new Function(`return ${ e.data };`)() : { type: "text", text: e.data }
            dispatch("ondata", data, { root: true })
          } else if (type === "oncommand") {
            const command = event.data.command
            commit("oncommand", command)
            const data = { type: "text", text: `<hiy>${command}</hiy>` }
            dispatch("ondata", data, { root: true })
          }
        }
      },
    },
    ondata: {
      root: true,
      handler({ state, dispatch }, data) {
        const type = data.dialog || data.type || "type"

        dispatch("emit", { type, data }, { root: true })

        const event = data.type === "text" ? { data: data.text } : { data: JSON.stringify(data) }
        state.onmessage(event)

        // 屏蔽部分输出
        const blockList = [
          "msg",
          "itemadd",
          "itemremove",
          "sc",
        ]
        if (blockList.includes(type) === false) valkyrie.log(data)
      },
    },
    ontext: {
      root: true,
      handler({ dispatch }, text) {
        dispatch("ondata", { type: "text", text }, { root: true })
      },
    },
    sendCommand: {
      root: true,
      handler: ({ state }, command) => state.worker.postMessage({ type: "sendCommand", args: [command] }),
    },
    sendCommands: {
      root: true,
      handler: ({ state }, args) => state.worker.postMessage({ type: "sendCommands", args })
    },
    stopCommands: {
      root: true,
      handler: ({ state }) => state.worker.postMessage({ type: "stopCommands" }),
    },
  },
}
