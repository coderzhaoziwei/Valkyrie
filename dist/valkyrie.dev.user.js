// ==UserScript==
// @name         valkyrie
// @namespace    https://greasyfork.org/scripts/-----
// @version      0.0.3.dev
// @author       Coder Zhao
// @description  《武神传说》客户端功能增强
// @homepage     https://greasyfork.org/scripts/-----
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/valkyrie-beta/source/image/wakuang.png
// @supportURL   https://github.com/coderzhaoziwei/valkyrie/issues
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js
// @require      https://cdn.jsdelivr.net/npm/vuex@4/dist/vuex.global.js
// @require      https://cdn.jsdelivr.net/npm/pinia@next/dist/pinia.global.js
// @require      https://cdn.jsdelivr.net/npm/element3/dist/element3-ui.global.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.6.0/dist/gsap.min.js
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// ==/UserScript==

/* eslint-env: es6 */
/* eslint dot-notation: 0 */
/* global Vue: readonly */
/* global Vuex: readonly */
/* global Pinia: readonly */
/* global Element3: readonly */
/* global valkyrie: readonly */

(function (Vue, Pinia, vuex) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);
  var Pinia__default = /*#__PURE__*/_interopDefaultLegacy(Pinia);

  ({
    computed: {
      ...vuex.mapGetters([
        "textList",
      ]),
    },
    watch: {
      textList: {
        deep: true,
        async handler() {
          await Vue__default['default'].nextTick();
          document.getElementById("text-list-bottom").scrollIntoView({ behavior: "smooth" });
        },
      },
    },
  });

  Vue.createVNode("div", { id: "text-list-bottom" }, null, -1 );

  ({
    computed: {
      ...vuex.mapGetters([
        "chatList",
      ]),
    },
  });

  ({
    computed: {
      ...vuex.mapGetters([
        "textList",
      ]),
    },
    watch: {
      textList: {
        async handler() {
          await Vue__default['default'].nextTick();
          document.getElementById("text-list-bottom").scrollIntoView({ behavior: "smooth" });
        },
        deep: true,
      },
    },
  });

  Vue.createVNode("div", { id: "text-list-bottom" }, null, -1 );

  var script = Vue.defineComponent({
    name: "App",
    data() {
      return {}
    },
    computed: {},
    watch: {},
  });

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Left = Vue.resolveComponent("Left");
    const _component_Right = Vue.resolveComponent("Right");
    const _component_TextList = Vue.resolveComponent("TextList");
    return (Vue.openBlock(), Vue.createBlock("div", null, [
      (Vue.openBlock(), Vue.createBlock(Vue.Teleport, { to: "body" }, [
        Vue.createVNode(_component_Left)
      ])),
      (Vue.openBlock(), Vue.createBlock(Vue.Teleport, { to: "body" }, [
        Vue.createVNode(_component_Right)
      ])),
      (Vue.openBlock(), Vue.createBlock(Vue.Teleport, { to: "#text-list" }, [
        Vue.createVNode(_component_TextList)
      ]))
    ]))
  }

  script.render = render;
  script.__file = "src/component/App.vue";

  var head = "<!-- favicon -->\n<link rel=\"shortcut icon\" href=\"https://cdn.jsdelivr.net/gh/coderzhaoziwei/valkyrie/icon.png\" type=\"image/x-icon\">\n<!-- google font -->\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\"></link>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap\"></link>\n<!-- element3 style -->\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/element3/lib/theme-chalk/index.css\"></link>\n<!-- tailwindcss -->\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css\">\n\n<style>\nbody {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: center;\n}\n.login-content, .container {\n  order: 2;\n  margin: 0;\n  flex: 1 1 auto;\n  width: 256px;\n  min-width: 256px;\n  max-width: 768px;\n  /* border-left: 4px solid rgba(64, 64, 64, 0.5);\n  border-right: 4px solid rgba(64, 64, 64, 0.5);\n  font-size: 1rem !important; */\n}\n#left {\n  width: 256px;\n  order: 1;\n}\n#right {\n  width: 256px;\n  order: 3;\n}\n\n/* 地图 SVG 居中 */\n.room_exits {\n  display: flex;\n  justify-content: center;\n}\n.room_exits > svg {\n  margin-left: 0 !important;\n}\n</style>\n";

  var body = "<div id=\"app\" class=\"hidden\"></div>\n";

  var socketWorkerContent = "const commands = []\nconst handlers = {\n  create(uri) {\n    self.ws = new WebSocket(uri)\n    self.ws.onopen = () => {\n      self.postMessage({ type: \"readyState\", readyState: self.ws.readyState })\n      self.postMessage({ type: \"onopen\" })\n    }\n    self.ws.onclose = () => {\n      self.postMessage({ type: \"readyState\", readyState: self.ws.readyState })\n      self.postMessage({ type: \"onclose\" })\n    }\n    self.ws.onerror = () =>  {\n      self.postMessage({ type: \"readyState\", readyState: self.ws.readyState })\n      self.postMessage({ type: \"onerror\" })\n    }\n    self.ws.onmessage = event => {\n      const data = event.data\n      self.postMessage({ type: \"onmessage\", event: { data } })\n    }\n  },\n  sendCommand(command) {\n    self.ws.send(command)\n    self.postMessage({ type: \"oncommand\", command })\n  },\n  sendCommands(...args) {\n    args = args.flat(Infinity)\n    args.forEach((item, index) => {\n      if (/^setting/.test(item)) return\n      if (/,/.test(item)) args[index] = item.split(\",\")\n    })\n    commands.push(...args.flat(Infinity))\n  },\n  clearCommands() {\n    commands.splice(0)\n  },\n}\nconst loop = (ms = 256) => {\n  const command = commands.splice(0, 1)[0]\n  if (isNaN(Number(command)) === false) ms = Number(command)\n  if (typeof command === \"string\") {\n    if (command.includes(\"{\") && command.includes(\"}\")) {\n      const data = JSON.stringify({ type: \"custom-command\", command })\n      postMessage({ type: \"onmessage\", args: [ { data } ] })\n    } else {\n      handlers.sendCommand(command)\n    }\n  }\n  setTimeout(() => loop(), ms)\n}\nself.onmessage = function(event) {\n  const type = event.data.type\n  const args = event.data.args\n  handlers[type](...args)\n}\nloop()\n";

  const window = unsafeWindow;
  GM_info.script.version;
  const isDev = GM_info.script.version.includes("dev");
  const log = (...args) => {
    if (isDev === true) {
      GM_log(...args);
    }
  };

  const useEmitterStore = Pinia.defineStore({
    id: "emitter",
    state() {
      return {
        id: 0,
        types: {},
        handlers: {},
      }
    },
    actions: {
      emit({ type, data }) {
        const ids = this.types[type];
        if (Array.isArray(ids) === false) return
        ids.forEach(id => {
          if (id === undefined) return
          const { handler, handlerId } = this.handlers[id];
          if (typeof handler === "function") {
            handler(data, () => this.remove(handlerId));
          }
        });
      },
      on(type, handler) {
        this.add(type, handler);
        return () => this.remove(this.id)
      },
      add(type, handler) {
        const handlerId = (this.id ++);
        if (Array.isArray(this.types[type]) === false) {
          this.types[type] = [];
        }
        const typeIndex = this.types[type].length;
        this.types[type].push(handlerId);
        this.handlers[handlerId] = { type, typeIndex, handler, handlerId };
      },
      remove(id) {
        const { type, typeIndex, handler, handlerId } = this.handlers[id];
        delete this.handlers[handlerId];
        delete this.types[type][typeIndex];
      },
    },
  });

  const useSocketStore = Pinia.defineStore({
    id: "socket",
    state() {
      return {
        worker: null,
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
          const blob = new Blob([socketWorkerContent]);
          const url = URL.createObjectURL(blob);
          return new Worker(url)
        })();
        this.worker.onmessage = ({ data }) => {
          const { type, readyState, command, event } = data;
          if (typeof type !== "string") {
            throw new TypeError("data type is not string")
          } else if (type === "readyState") {
            this.readyState = readyState;
          } else if (type === "onopen") {
            this.onopen();
          } else if (type === "onclose") {
            this.onclose();
          } else if (type === "onerror") {
            this.onerror();
          } else if (type === "onmessage") {
            const data = (typeof event.data === "string" && event.data[0] === "{")
              ? new Function(`return ${ event.data };`)()
              : { type: "text", text: event.data };
            this.ondata(data);
          } else if (type === "oncommand") {
            const text = `<hiy>${command}</hiy>`;
            this.ontext(text);
          }
        };
        const socket = this;
        window.WebSocket = function(uri) {
          socket.worker.postMessage({ type: "create", args: [uri] });
        };
        window.WebSocket.prototype = {
          set onopen(fn) {
            socket.onopen = fn;
          },
          set onclose(fn) {
            socket.onclose = fn;
          },
          set onerror(fn) {
            socket.onerror = fn;
          },
          set onmessage(fn) {
            socket.onmessage = fn;
          },
          get readyState() {
            return socket.readyState
          },
          send(command) {
            socket.send(command);
          },
        };
      },
      send(...args) {
        this.worker.postMessage({ type: "sendCommands", args });
      },
      stop() {
        this.worker.postMessage({ type: "stopCommands" });
      },
      ondata(data) {
        const type = data.dialog || data.type || "type";
        const emitter = useEmitterStore();
        emitter.emit(type, data);
        const event = data.type === "text" ? { data: data.text } : { data: JSON.stringify(data) };
        this.onmessage(event);
        const exclude = [
          "msg",
          "itemadd",
          "itemremove",
          "sc",
        ];
        if (exclude.includes(type) === false) log(data);
      },
      ontext(text) {
        this.ondata({ type: "text", text });
      },
    },
  });

  const pinia = Pinia__default['default'].createPinia();
  const app = Vue__default['default'].createApp(script);
  app.use(pinia);
  app.use(Element3);
  const socket = useSocketStore();
  socket.init();
  unsafeWindow.valkyrie = {};
  unsafeWindow.valkyrie.log = (...args) => {
    if (unsafeWindow.valkyrie.dev === true) {
      GM_log(...args);
    }
  };
  unsafeWindow.valkyrie.sleep = ms => {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
  };
  unsafeWindow.valkyrie.hasOwn = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  };
  unsafeWindow.valkyrie.setCookie = (name, value) => {
    document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  };
  unsafeWindow.valkyrie.getCookie = (name) => {
    const cookies = document.cookie.split(";").reduce((cookies, cookieString) => {
      const i = cookieString.indexOf("=");
      const name = cookieString.substr(0, i).trim();
      const value = cookieString.substr(i + 1);
      cookies[name] = value;
      return cookies
    }, {});
    return cookies[name]
  };
  unsafeWindow.valkyrie.updateToolBarPosition = () => {
    if (document.querySelector(".content-bottom").offsetHeight === 0) {
      document.querySelector("[command=showcombat]").click();
    }
    if (document.querySelector(".right-bar").offsetWidth === 0) {
      document.querySelector("[command=showtool]").click();
    }
    clearTimeout(unsafeWindow.valkyrie.updateToolBarPositionId);
    unsafeWindow.valkyrie.updateToolBarPositionId = setTimeout(() => {
      const h1 = document.querySelector(".content-bottom").clientHeight;
      const h2 = document.querySelector(".tool-bar.bottom-bar").clientHeight;
      document.querySelector(".right-bar").style.bottom = h1 + h2 + "px";
    }, 1000);
  };
  unsafeWindow.addEventListener("resize", () => {
    unsafeWindow.valkyrie.updateToolBarPosition();
  });
  document.addEventListener("DOMContentLoaded", function() {
    valkyrie.log("document.event: DOMContentLoaded");
    document.head.insertAdjacentHTML("beforeend", head);
    document.body.insertAdjacentHTML("beforeend", body);
    addClassName("body", "md:flex");
    app.mount("#app");
  });
  unsafeWindow.console.log = () => {};
  function addClassName(selector, className) {
    document.querySelectorAll(selector).forEach(element => {
      className.split(" ").forEach(className => {
        if (className) element.classList.add(className);
      });
    });
  }

}(Vue, Pinia, Vuex));
