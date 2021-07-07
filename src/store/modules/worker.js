import content from "./worker/content.js"

const state = () => ({
  worker: null, // 子线程 Worker 对象
  socket: {     // 伪 WebSocket 中间件
    readyState: 0,
    onopen: () => {},
    onclose: () => {},
    onerror: () => {},
    onmessage: () => {},
  },
})
const getters = {}
const mutations = {
  initWorker(state) {
    console.log("initWorker")
    state.worker = new Worker(URL.createObjectURL(new Blob([content])))
  },
}
const actions = {
  initWebSocket({ state, getters, commit, dispatch }) {
    console.log("initWebSocket")

    // 重写全局 WebSocket 类
    unsafeWindow.WebSocket = function(uri) {
      state.worker.postMessage({ type: "create", args: [uri] })
    }
    unsafeWindow.WebSocket.prototype = {
      set onopen(fn) {
        state.socket.onopen = fn
      },
      set onclose(fn) {
        state.socket.onclose = fn
      },
      set onerror(fn) {
        state.socket.onerror = fn
      },
      set onmessage(fn) {
        state.socket.onmessage = fn
      },
      get readyState() {
        return state.socket.readyState
      },
      send(command) {
        dispatch("sendCommand", command)
      },
    }
  },
  initWebWorker({ state, getters, commit, dispatch }) {
    console.log("initWebWorker")
    state.worker.onmessage = event => {
      const type = event.data.type
      const args = event.data.args
      // 处理函数集合
      const handlers = {
        onopen: event => state.socket.onopen(event),
        onclose: event => state.socket.onclose(event),
        onerror: event => state.socket.onerror(event),
        onmessage: event => {
          const data = eventToData(event)
          dispatch("onData", data)
        },
        readyState: value => (state.socket.readyState = value),
      }
      try {
        handlers[type](...args)
      } catch (error) {
        console.log(type)
        console.log(...args)
        console.error(error)
      }
    }
  },
  init({ state, getters, commit, dispatch }) {
    commit("initWorker")
    dispatch("initWebSocket")
    dispatch("initWebWorker")
  },
  sendCommand({ state, getters, commit, dispatch }, command) {
    state.worker.postMessage({ type: "sendCommand", args: [command] })
    dispatch("onData", { type: "sendCommand", command })
  },
  sendCommands({ state, getters, commit, dispatch }, ...args) {
    state.worker.postMessage({ type: "sendCommands", args })
    dispatch("onData", { type: "sendCommands", args })
  },
  stopCommands({ state, getters, commit, dispatch }) {
    state.worker.postMessage({ type: "stopCommands" })
    dispatch("onData", { type: "stopCommands" })
  },
  // 接收 Worker 线程中的 WebSocket 的 data 数据
  onData({ state, getters, commit, dispatch }, data) {
    console.log(data)
    // 触发事件
    const type = data.dialog || data.type || "type"
    dispatch("emitter/emit", { type, data }, { root: true })
    // 返回至 socket.onmessage 中处理
    const event = dataToEvent(data)
    state.socket.onmessage(event)
  },
  onText({ state, getters, commit, dispatch }, text) {
    dispatch("onData", { type: "text", text })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

function eventToData(event) {
  const data = event.data
  if (typeof data === "string" && data[0] === "{") {
    try {
      return new Function(`return ${ data };`)()
    } catch (error) {}
  }
  return { type: "text", text: data }
}
function dataToEvent(data) {
  if (data.type === "text") {
    return { data: data.text }
  }
  return { data: JSON.stringify(data) }
}
