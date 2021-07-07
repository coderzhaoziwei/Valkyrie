// ==UserScript==
// @name         valkyrie
// @namespace    https://greasyfork.org/scripts/-----
// @version      0.0.3
// @author       Coder Zhao
// @description  《武神传说》客户端功能增强
// @homepage     https://greasyfork.org/scripts/-----
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/valkyrie-beta/source/image/wakuang.png
// @supportURL   https://github.com/coderzhaoziwei/valkyrie/issues
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.min.js
// @require      https://cdn.jsdelivr.net/npm/vuex@4/dist/vuex.global.min.js
// @require      https://cdn.jsdelivr.net/npm/element3/dist/element3-ui.global.min.js
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
/* global Element3: readonly */

(function (Vue, vuex) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);

  var content = "class Worker {\n  constructor() {\n    this.websocket = undefined\n    this.commands = []\n    this.senderState = false\n  }\n  post(type, ...args) {\n    postMessage({ type, args })\n  }\n  create(uri) {\n    this.websocket = new WebSocket(uri)\n    this.websocket.onopen = () => {\n      this.post(\"readyState\", this.websocket.readyState)\n      console.log(\"WebSocket.readyState: \" + this.websocket.readyState)\n      this.post(\"onopen\")\n      console.log(\"WebSocket.onopen\")\n    }\n    this.websocket.onclose = () => {\n      this.post(\"readyState\", this.websocket.readyState)\n      console.log(\"WebSocket.readyState: \" + this.websocket.readyState)\n      this.post(\"onclose\")\n      console.log(\"WebSocket.onclose\")\n    }\n    this.websocket.onerror = () =>  {\n      this.post(\"readyState\", this.websocket.readyState)\n      console.log(\"WebSocket.readyState: \" + this.websocket.readyState)\n      this.post(\"onerror\")\n      console.log(\"WebSocket.onerror\")\n    }\n    this.websocket.onmessage = event => {\n      this.post(\"onmessage\", { data: event.data })\n    }\n  }\n  sendCommand(command) {\n    this.websocket.send(command)\n  }\n  sendCommands(...args) {\n    args = args.flat(Infinity)\n    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(\",\")))\n    args = args.flat(Infinity)\n    this.commands.push(...args)\n    if (this.senderState === false) {\n      this.senderState = true\n      this.sender()\n    }\n  }\n  stopCommands() {\n    this.commands.splice(0)\n    this.senderState = false\n  }\n  sender(ms = 256) {\n    const command = this.commands.splice(0, 1)[0]\n    if (command === undefined) return (this.senderState = false)\n    const number = Number(command)\n    if (isNaN(number) === false) return this.sender(number)\n    if (typeof command === \"string\" && command.includes(\"{\") && command.includes(\"}\")) {\n      return setTimeout(() => {\n        const data = JSON.stringify({ type: \"custom-command\", command })\n        postMessage({ type: \"websocketOnmessage\", args: [{ data }] })\n        this.sender()\n      }, ms)\n    }\n    if (typeof command === \"string\") {\n      setTimeout(() => {\n        this.sendCommand(command)\n        this.sender()\n      }, ms)\n    }\n  }\n}\nconst worker = new Worker()\nonmessage = function(event) {\n  const type = event.data.type\n  const args = event.data.args\n  try {\n    worker[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

  const state$1 = () => ({
    worker: null,
    socket: {
      readyState: 0,
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      onmessage: () => {},
    },
  });
  const getters$1 = {};
  const mutations$1 = {
    initWorker(state) {
      state.worker = new Worker(URL.createObjectURL(new Blob([content])));
    },
  };
  const actions$1 = {
    initWebSocket({ state, getters, commit, dispatch }) {
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
      const type = data.dialog || data.type || "type";
      dispatch("emit", { type, data });
      const event = dataToEvent(data);
      state.socket.onmessage(event);
    },
    onText({ state, getters, commit, dispatch }, text) {
      dispatch("onData", { type: "text", text });
    },
  };
  var worker = {
    state: state$1,
    getters: getters$1,
    actions: actions$1,
    mutations: mutations$1,
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

  var onlogin = {
    actions: {
      init({ rootState, commit, dispatch }) {
        dispatch("on", { type: "roles", handler(data) {
          if (Array.isArray(data.roles) === false) return
          data.roles.forEach(role => commit("updateRole", role));
          console.log(JSON.parse(JSON.stringify(rootState.roles)));
        } });
        dispatch("on", { type: "login", async handler(data) {
          const id = data.id;
          const count = (rootState.roles[id].count || 0) + 1;
          const cookies = {
            u: await dispatch("getCookie", "u"),
            p: await dispatch("getCookie", "p"),
            s: await dispatch("getCookie", "s"),
          };
          const token = cookies.u + " " + cookies.p;
          const server = ["一区", "二区", "三区", "四区", "五区", "六区"][cookies.s];
          commit("updateRole", { id, count, cookies, token, server });
          commit("updateId", id);
        } });
        dispatch("on", { type: "login", async handler() {
          dispatch("sendCommands", "pack,score2,score");
          await dispatch("wait", 1000);
          document.querySelector("[command=skills]").click();
          await dispatch("wait", 1000);
          document.querySelector("[command=tasks]").click();
          await dispatch("wait", 1000);
          document.querySelector(".dialog-close").click();
          dispatch("updateToolBarPosition");
        } });
        unsafeWindow.addEventListener("resize", () => dispatch("updateToolBarPosition"));
      },
      updateToolBarPosition() {
        if (document.querySelector(".content-bottom").offsetHeight === 0) {
          document.querySelector("[command=showcombat]").click();
        }
        if (document.querySelector(".right-bar").offsetWidth === 0) {
          document.querySelector("[command=showtool]").click();
        }
        setTimeout(() => {
          const h1 = document.querySelector(".content-bottom").clientHeight;
          const h2 = document.querySelector(".tool-bar.bottom-bar").clientHeight;
          document.querySelector(".right-bar").style.bottom = h1 + h2 + "px";
        }, 1000);
      },
    },
  };

  var onstate = {
    actions: {
      init({ commit, dispatch }) {
        console.log("actions => init => onstate.js");
        dispatch("on", {
          type: "state",
          handler(data) {
            const text = [
              "打坐",
              "疗伤",
              "读书",
              "学习",
              "练习",
              "修炼",
              "工作",
              "挖矿",
              "采药",
              "钓鱼",
              "炼药",
              "闭关",
              "领悟",
              "聚魂",
              "推演",
            ].find(text => (typeof data.state === "string") && data.state.includes(text));
            const state = text || data.state || "";
            data.state = state;
            delete data.desc;
            commit("updateState", state);
          },
        });
        dispatch("on", {
          type: "combat",
          handler(data) {
            if (data.start === 1) commit("updateState", "战斗");
            else if (data.end === 1) commit("updateState", "");
          },
        });
        dispatch("on", {
          type: "die",
          handler(data) {
            if (data.relive === true) commit("updateState", "");
            else commit("updateState", "死亡");
          },
        });
      },
    },
  };

  var onscore = {
    actions: {
      init({ rootState, commit, dispatch }) {
        const handler = async data => {
          if (data.id !== rootState.id) return
          commit("updateScore", data);
        };
        dispatch("on", { type: "sc", handler });
        dispatch("on", { type: "score", handler });
      },
    },
  };

  const state = () => ({
  });
  const getters = {
    getter(state) {
    },
  };
  const mutations = {
    commit(state) {
    },
  };
  const actions = {
    init({ rootState, getters, commit, dispatch }) {
      dispatch("on", {
        type: "room",
        handler(data) {
          const { name, path, desc, cmds } = data;
          const names = name.split(/-|\(|\)/);
          const x = names[0];
          const y = names[1];
          commit("updateRoom", { name, path, desc, cmds, x, y });
        },
      });
      dispatch("on", {
        type: "exits",
        handler(data) {
          if (Array.isArray(data.items) === false) return
          const exits = [];
          Object.keys(data.items).forEach(x => {
            const name = data.items[x];
            const command = `go ${x}`;
            exits.push({ name, command });
          });
          commit("updateRoom", { exits });
        },
      });
    },
  };
  var onroom = {
    state,
    getters,
    actions,
    mutations,
  };

  class Base {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
    }
    get nameText() {
      return this.name.replace(/<\S+?>/g, ``)
    }
    get colorValue() {
      const index = [
        /^<(hiw|wht)>/i,
        /^<hig>/i,
        /^<hic>/i,
        /^<hiy>/i,
        /^<hiz>/i,
        /^<hio>/i,
        /^<(hir|ord|red)>/i,
        /^<\S\S\S>/,
      ].findIndex(regexp => regexp.test(this.name)) + 1;
      if (index === 8) {
        console.warn(this.name);
      }
      return index
    }
  }

  class Role extends Base {
    constructor(data) {
      super(data);
      this.hp = data.hp || 0;
      this.mp = data.mp || 0;
      this.max_hp = data.max_hp || 0;
      this.max_mp = data.max_mp || 0;
      this.status = data.status || [];
      this.p = data.p || 0;
    }
    get isSelf() {
      return this.id === unsafeWindow.id
    }
    get isPlayer() {
      return this.p === 1
    }
    get isOffline() {
      return this.name.includes(`<red>&lt;断线中&gt;</red>`)
    }
    get isNpc() {
      return !this.isPlayer
    }
    get sortValue() {
      if (this.isSelf) return 0
      if (this.isNpc) return this.colorValue
      return this.colorValue + (this.isOffline ? 2000 : 1000)
    }
  }

  const onItems = ({ state, getters, commit, dispatch, rootState }) => {
    const type = "items";
    const handler = data => {
      console.log(data);
      if (Array.isArray(data.items) === false) return
      const items = [];
      data.items.forEach(data => data && items.push(new Role(data)));
      items.sort((a, b) => a.sortValue - b.sortValue);
      data.items = items;
      commit("updateItems", items);
    };
    dispatch("on", { type, handler });
  };
  const onItemAdd = ({ state, getters, commit, dispatch, rootState }) => {
    const type = "itemadd";
    const handler = data => {
      const role = new Role(data);
      const items = rootState.items.slice(0);
      const index = items.findIndex(item => item.id === role.id);
      if (index !== -1) {
        items.splice(index, 1, role);
      } else {
        items.push(role);
      }
      items.sort((a, b) => a.sortValue - b.sortValue);
      commit("updateItems", items);
      data.type = "items";
      data.items = items;
    };
    dispatch("on", { type, handler });
  };
  const onItemRemove = ({ state, getters, commit, dispatch, rootState }) => {
    const type = "itemremove";
    const handler = data => {
      const items = rootState.items.slice(0);
      const index = items.findIndex(item => item.id === data.id);
      if (index !== -1) items.splice(index, 1);
      commit("updateItems", items);
    };
    dispatch("on", { type, handler });
  };
  const onSc = ({ state, getters, commit, dispatch, rootState }) => {
    const type = "sc";
    const handler = data => {
      const items = rootState.items.slice(0);
      const index = items.findIndex(item => item.id === data.id);
      if (index === -1) return
      const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
      if (hasOwn(data, "hp")) items[index].hp = Number(data.hp);
      if (hasOwn(data, "mp")) items[index].mp = Number(data.mp);
      if (hasOwn(data, "max_hp")) items[index].max_hp = Number(data.max_hp);
      if (hasOwn(data, "max_mp")) items[index].max_mp = Number(data.max_mp);
      commit("updateItems", items);
    };
    dispatch("on", { type, handler });
  };
  var onitems = {
    actions: {
      init(context) {
        console.log("onitems.js");
        onItems(context);
        onItemAdd(context);
        onItemRemove(context);
        onSc(context);
      },
    },
  };

  const store = vuex.createStore({
    state() {
      return {
        roles: {},
        id: undefined,
        state: "",
        score: {},
        room: {},
        items: [],
        npcs: [],
      }
    },
    mutations: {
      updateRole: (state, data) => {
        state.roles = JSON.parse(localStorage.getItem("roles") || "{}");
        const id = data.id;
        state.roles[id] = Object.assign(state.roles[id] || {}, data);
        localStorage.setItem("roles", JSON.stringify(state.roles));
      },
      updateId(state, data) {
        state.id = data;
        unsafeWindow.id = data;
      },
      updateState: (state, data) => (state.state = data),
      updateScore: (state, data) => Object.assign(state.score, data),
      updateRoom: (state, data) => Object.assign(state.room, data),
      updateItems(state, data) {
        state.items.splice(0);
        state.items.push(...data);
        state.npcs.splice(0);
        state.npcs.push(...data.filter(item => item.isNpc));
      },
    },
    actions: {
      async wait(context, ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms))
      },
      setCookie(context, { name, value }) {
        document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      },
      getCookie(context, name) {
        const cookies = document.cookie.split(";").reduce((cookies, cookieString) => {
          const i = cookieString.indexOf("=");
          const name = cookieString.substr(0, i).trim();
          const value = cookieString.substr(i + 1);
          cookies[name] = value;
          return cookies
        }, {});
        return cookies[name]
      },
    },
    modules: {
      worker,
      emitter,
      onlogin,
      onroom,
      onitems,
      onstate,
      onscore,
    },
  });

  var head = "<!-- favicon -->\n<link rel=\"shortcut icon\" href=\"https://cdn.jsdelivr.net/gh/coderzhaoziwei/valkyrie/icon.png\" type=\"image/x-icon\">\n<!-- google font -->\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\"></link>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap\"></link>\n<!-- element3 style -->\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/element3/lib/theme-chalk/index.css\"></link>\n";

  var script = {
    data() {
      return {
        msg: "Hello world.",
      }
    },
    computed: {
      ...vuex.mapState(["roles", "id", "state", "npcs", "items"]),
      title() {
        const role = this.roles[this.id];
        if (role !== undefined) return role.name + " " + this.state + " " + role.server
      },
    },
    watch: {
      title(value) {
        document.title = value;
      },
    },
  };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (Vue.openBlock(), Vue.createBlock("div", null, [
      (Vue.openBlock(true), Vue.createBlock(Vue.Fragment, null, Vue.renderList(_ctx.items, (item, key) => {
        return (Vue.openBlock(), Vue.createBlock("div", { key: key }, Vue.toDisplayString(item.name), 1 ))
      }), 128 ))
    ]))
  }

  script.render = render;
  script.__file = "src/components/App.vue";

  store.dispatch("init");
  unsafeWindow.Vue = Vue__default['default'];
  unsafeWindow.store = store;
  document.addEventListener("DOMContentLoaded", function() {
    console.log("document.event: DOMContentLoaded");
    document.head.insertAdjacentHTML("beforeend", head);
    document.body.insertAdjacentHTML("beforeend", `<div id="app"></div>`);
    const app = Vue__default['default'].createApp(script);
    app.use(store);
    app.use(Element3);
    app.mount("#app");
  });

}(Vue, Vuex));
