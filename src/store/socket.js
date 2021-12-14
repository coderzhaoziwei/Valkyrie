import { defineStore } from "pinia"
import socketWorkerContent from "./socket_worker_content.js"
import { window, log } from "../global"
import { useEmitterStore } from "./emitter"

export const useSocketStore = defineStore({
  id: "socket",
  state() {
    return {
      // 运行 WebSocket 的子线程实例
      worker: null,
      // 用于记录与转发 WebSocket 的属性值
      readyState: 0,
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      onmessage: () => {},
    }
  },
  getters: {},
  actions: {
    init() {
      this.worker = (function() {
        const blob = new Blob([socketWorkerContent])
        const url = URL.createObjectURL(blob)
        return new Worker(url)
      })()
      this.worker.onmessage = ({ data }) => {
        const { type, readyState, command, event } = data
        if (typeof type !== "string") {
          throw new TypeError("data type is not string")
        } else if (type === "readyState") {
          this.readyState = readyState
        } else if (type === "onopen") {
          this.onopen()
        } else if (type === "onclose") {
          this.onclose()
        } else if (type === "onerror") {
          this.onerror()
        } else if (type === "onmessage") {
          const data = (typeof event.data === "string" && event.data[0] === "{")
            ? new Function(`return ${ event.data };`)()
            : { type: "text", text: event.data }
          this.ondata(data)
        } else if (type === "oncommand") {
          const text = `<hiy>${command}</hiy>`
          this.ontext(text)
        }
      }

      const socket = this
      window.WebSocket = function(uri) {
        socket.worker.postMessage({ type: "create", args: [uri] })
      }
      window.WebSocket.prototype = {
        set onopen(fn) {
          socket.onopen = fn
        },
        set onclose(fn) {
          socket.onclose = fn
        },
        set onerror(fn) {
          socket.onerror = fn
        },
        set onmessage(fn) {
          socket.onmessage = fn
        },
        get readyState() {
          return socket.readyState
        },
        send(command) {
          socket.send(command)
        },
      }
    },
    send(...args) {
      this.worker.postMessage({ type: "sendCommands", args })
    },
    stop() {
      this.worker.postMessage({ type: "stopCommands" })
    },
    ondata(data) {
      // 类型
      const type = data.dialog || data.type || "type"
      // 触发
      const emitter = useEmitterStore()
      emitter.emit(type, data)
      // 复原
      const event = data.type === "text" ? { data: data.text } : { data: JSON.stringify(data) }
      this.onmessage(event)
      // 输出
      const exclude = [
        "msg",
        "itemadd",
        "itemremove",
        "sc",
      ]
      if (exclude.includes(type) === false) log(data)
    },
    ontext(text) {
      this.ondata({ type: "text", text })
    },
  },
})
