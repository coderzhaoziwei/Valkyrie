// ==UserScript==
// @name         valkyrie
// @namespace    https://greasyfork.org/scripts/-----
// @version      0.0.2
// @author       Coder Zhao
// @description  《武神传说》客户端功能增强
// @homepage     https://greasyfork.org/scripts/-----
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/valkyrie-beta/source/image/wakuang.png
// @supportURL   https://github.com/coderzhaoziwei/valkyrie/issues
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.min.js
// @require      https://cdn.jsdelivr.net/npm/vuex@4/dist/vuex.global.min.js
// @require      https://cdn.jsdelivr.net/npm/element3@0.0.39/dist/element3-ui.global.min.js
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

(function (vue, vuex) {
  'use strict';

  var script = {
    data() {
      return {
        msg: "Hello world.",
      }
    },
  };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (vue.openBlock(), vue.createBlock("div", null, vue.toDisplayString($data.msg), 1 ))
  }

  script.render = render;
  script.__file = "src/components/App.vue";

  var content = "class Worker {\n  constructor() {\n    this.websocket = undefined\n    this.commands = []\n    this.senderState = false\n  }\n  post(type, ...args) {\n    postMessage({ type, args })\n  }\n  create(uri) {\n    this.websocket = new WebSocket(uri)\n    this.websocket.onopen = () => {\n      this.post(\"readyState\", this.websocket.readyState)\n      console.log(\"WebSocket.readyState: \" + this.websocket.readyState)\n      this.post(\"onopen\")\n      console.log(\"WebSocket.onopen\")\n    }\n    this.websocket.onclose = () => {\n      this.post(\"readyState\", this.websocket.readyState)\n      console.log(\"WebSocket.readyState: \" + this.websocket.readyState)\n      this.post(\"onclose\")\n      console.log(\"WebSocket.onclose\")\n    }\n    this.websocket.onerror = () =>  {\n      this.post(\"readyState\", this.websocket.readyState)\n      console.log(\"WebSocket.readyState: \" + this.websocket.readyState)\n      this.post(\"onerror\")\n      console.log(\"WebSocket.onerror\")\n    }\n    this.websocket.onmessage = event => {\n      this.post(\"onmessage\", { data: event.data })\n    }\n  }\n  sendCommand(command) {\n    this.websocket.send(command)\n  }\n  sendCommands(...args) {\n    args = args.flat(Infinity)\n    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(\",\")))\n    args = args.flat(Infinity)\n    this.commands.push(...args)\n    if (this.senderState === false) {\n      this.senderState = true\n      this.sender()\n    }\n  }\n  stopCommands() {\n    this.commands.splice(0)\n    this.senderState = false\n  }\n  sender(ms = 256) {\n    const command = this.commands.splice(0, 1)[0]\n    if (command === undefined) return (this.senderState = false)\n    const number = Number(command)\n    if (isNaN(number) === false) return this.sender(number)\n    if (typeof command === \"string\" && command.includes(\"{\") && command.includes(\"}\")) {\n      return setTimeout(() => {\n        const data = JSON.stringify({ type: \"custom-command\", command })\n        postMessage({ type: \"websocketOnmessage\", args: [{ data }] })\n        this.sender()\n      }, ms)\n    }\n    if (typeof command === \"string\") {\n      setTimeout(() => {\n        this.sendCommand(command)\n        this.sender()\n      }, ms)\n    }\n  }\n}\nconst worker = new Worker()\nonmessage = function(event) {\n  const type = event.data.type\n  const args = event.data.args\n  try {\n    worker[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

  const state = () => ({
    worker: null,
    socket: {
      readyState: 0,
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      onmessage: () => {},
    },
  });
  const getters = {};
  const mutations = {
    initWorker(state) {
      console.log("initWorker");
      state.worker = new Worker(URL.createObjectURL(new Blob([content])));
    },
  };
  const actions = {
    initWebSocket({ state, getters, commit, dispatch }) {
      console.log("initWebSocket");
      unsafeWindow.WebSocket = function(uri) {
        state.worker.postMessage({ type: "create", args: [uri] });
      };
      unsafeWindow.WebSocket.prototype = {
        set onopen(fn) {
          state.socket.onopen = fn;
        },
        set onclose(fn) {
          state.socket.onclose = fn;
        },
        set onerror(fn) {
          state.socket.onerror = fn;
        },
        set onmessage(fn) {
          state.socket.onmessage = fn;
        },
        get readyState() {
          return state.socket.readyState
        },
        send(command) {
          dispatch("sendCommand", command);
        },
      };
    },
    initWebWorker({ state, getters, commit, dispatch }) {
      console.log("initWebWorker");
      state.worker.onmessage = event => {
        const type = event.data.type;
        const args = event.data.args;
        const handlers = {
          onopen: event => state.socket.onopen(event),
          onclose: event => state.socket.onclose(event),
          onerror: event => state.socket.onerror(event),
          onmessage: event => {
            const data = eventToData(event);
            dispatch("onData", data);
          },
          readyState: value => (state.socket.readyState = value),
        };
        try {
          handlers[type](...args);
        } catch (error) {
          console.log(type);
          console.log(...args);
          console.error(error);
        }
      };
    },
    init({ state, getters, commit, dispatch }) {
      commit("initWorker");
      dispatch("initWebSocket");
      dispatch("initWebWorker");
    },
    sendCommand({ state, getters, commit, dispatch }, command) {
      state.worker.postMessage({ type: "sendCommand", args: [command] });
      dispatch("onData", { type: "sendCommand", command });
    },
    sendCommands({ state, getters, commit, dispatch }, ...args) {
      state.worker.postMessage({ type: "sendCommands", args });
      dispatch("onData", { type: "sendCommands", args });
    },
    stopCommands({ state, getters, commit, dispatch }) {
      state.worker.postMessage({ type: "stopCommands" });
      dispatch("onData", { type: "stopCommands" });
    },
    onData({ state, getters, commit, dispatch }, data) {
      console.log(data);
      const type = data.dialog || data.type || "type";
      dispatch("emitter/emit", { type, data }, { root: true });
      const event = dataToEvent(data);
      state.socket.onmessage(event);
    },
    onText({ state, getters, commit, dispatch }, text) {
      dispatch("onData", { type: "text", text });
    },
  };
  var worker = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  };
  function eventToData(event) {
    const data = event.data;
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

  var emitter = {
    namespaced: true,
    state() {
      return {
        id: 0,
        types: {},
        handlers: {},
      }
    },
    mutations: {
      addHandler(state, { type, handler }) {
        const handlerId = (++ state.id);
        if (Array.isArray(state.types[type]) === false) {
          state.types[type] = [];
        }
        const typeIndex = state.types[type].length;
        state.types[type].push(handlerId);
        state.handlers[handlerId] = { type, typeIndex, handler, handlerId };
      },
      deleteHandler(state, id) {
        const { type, typeIndex, handler, handlerId } = state.handlers[id];
        delete state.handlers[handlerId];
        delete state.types[type][typeIndex];
      },
    },
    actions: {
      emit({ state, commit }, { type, data }) {
        const ids = state.types[type];
        if (Array.isArray(ids) === false) return
        ids.forEach(id => {
          if (id === undefined) return
          const { handler, handlerId } = state.handlers[id];
          if (typeof handler === "function") {
            handler(data, () => commit("deleteHandler", handlerId));
          }
        });
      },
      on({ state, commit }, { type, handler }) {
        commit("addHandler", { type, handler });
        return () => commit("deleteHandler", state.id)
      },
    },
  };

  const store = vuex.createStore({
    state() {
      return {}
    },
    mutations: {},
    actions: {},
    modules: {
      worker,
      emitter,
    }
  });

  const app = vue.createApp(script);
  app.use(store);
  store.dispatch("worker/init");
  document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded");
    document.body.insertAdjacentHTML(`beforeend`, `<div id="app"></div>`);
    unsafeWindow.Valkyrie = app.mount(`#app`);
  });

}(Vue, Vuex));
