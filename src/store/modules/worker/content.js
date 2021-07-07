// 此文件为 Worker 线程中执行的代码

class Worker {
  constructor() {
    this.websocket = undefined
    this.commands = []
    this.senderState = false
  }
  // 发送事件至主线程
  post(type, ...args) {
    postMessage({ type, args })
  }
  // 创建 WebSocket 对象
  create(uri) {
    this.websocket = new WebSocket(uri)
    this.websocket.onopen = () => {
      this.post("readyState", this.websocket.readyState)
      console.log("WebSocket.readyState: " + this.websocket.readyState)
      this.post("onopen")
      console.log("WebSocket.onopen")
    }
    this.websocket.onclose = () => {
      this.post("readyState", this.websocket.readyState)
      console.log("WebSocket.readyState: " + this.websocket.readyState)
      this.post("onclose")
      console.log("WebSocket.onclose")
    }
    this.websocket.onerror = () =>  {
      this.post("readyState", this.websocket.readyState)
      console.log("WebSocket.readyState: " + this.websocket.readyState)
      this.post("onerror")
      console.log("WebSocket.onerror")
    }
    this.websocket.onmessage = event => {
      this.post("onmessage", { data: event.data })
    }
  }
  // 发送单个指令
  sendCommand(command) {
    this.websocket.send(command)
  }
  // 发送指令队列
  sendCommands(...args) {
    args = args.flat(Infinity)
    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(",")))
    args = args.flat(Infinity)

    this.commands.push(...args)

    if (this.senderState === false) {
      this.senderState = true
      this.sender()
    }
  }
  // 停止指令队列
  stopCommands() {
    this.commands.splice(0)
    this.senderState = false
  }
  // 循环指令队列
  sender(ms = 256) {
    const command = this.commands.splice(0, 1)[0] // 取首位
    // 1. undefined
    if (command === undefined) return (this.senderState = false)
    // 2. number
    const number = Number(command)
    if (isNaN(number) === false) return this.sender(number)
    // 3. string && custom-command
    if (typeof command === "string" && command.includes("{") && command.includes("}")) {
      return setTimeout(() => {
        const data = JSON.stringify({ type: "custom-command", command })
        postMessage({ type: "websocketOnmessage", args: [{ data }] })
        this.sender()
      }, ms)
    }
    // 4. string
    if (typeof command === "string") {
      setTimeout(() => {
        this.sendCommand(command)
        this.sender()
      }, ms)
    }
  }
}

const worker = new Worker()

// 接收主线程事件
onmessage = function(event) {
  const type = event.data.type
  const args = event.data.args
  try {
    worker[type](...args)
  } catch (error) {
    console.error(error)
  }
}
