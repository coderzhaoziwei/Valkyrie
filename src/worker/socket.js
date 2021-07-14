/**
 * 接收来自主线程的消息
 *
 * 1. 创建 WebSocket 对象
 *    { type: "create", uri }
 * 2. 发送指令
 *    { type: "sendCommand", command }
 * 3. 发送指令队列
 *    { type: "sendCommands", args }
 * 4. 清空指令队列
 *    { type: "clearCommands" }
 *
 */

const commands = []
const handlers = {
  create(uri) {
    self.ws = new WebSocket(uri)
    self.ws.onopen = () => {
      self.postMessage({ type: "readyState", readyState: self.ws.readyState })
      self.postMessage({ type: "onopen" })
    }
    self.ws.onclose = () => {
      self.postMessage({ type: "readyState", readyState: self.ws.readyState })
      self.postMessage({ type: "onclose" })
    }
    self.ws.onerror = () =>  {
      self.postMessage({ type: "readyState", readyState: self.ws.readyState })
      self.postMessage({ type: "onerror" })
    }
    self.ws.onmessage = event => {
      const data = event.data
      self.postMessage({ type: "onmessage", event: { data } })
    }
  },
  sendCommand(command) {
    self.ws.send(command)
    self.postMessage({ type: "oncommand", command })
  },
  sendCommands(...args) {
    args = args.flat(Infinity)
    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(",")))
    commands.push(...args.flat(Infinity))
  },
  clearCommands() {
    commands.splice(0)
  },
}
const loop = (ms = 256) => {
  const command = commands.splice(0, 1)[0]
  if (isNaN(Number(command)) === false) ms = Number(command)
  if (typeof command === "string") {
    if (command.includes("{") && command.includes("}")) {
      const data = JSON.stringify({ type: "custom-command", command })
      postMessage({ type: "onmessage", args: [ { data } ] })
    } else {
      handlers.sendCommand(command)
    }
  }
  setTimeout(() => loop(), ms)
}
self.onmessage = function(event) {
  const type = event.data.type
  const args = event.data.args
  handlers[type](...args)
}
loop()
