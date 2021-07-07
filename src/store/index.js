import { createStore } from "vuex"

import worker from "./modules/worker"
import emitter from "./modules/emitter"

const store = createStore({
  state() {
    return {}
  },
  mutations: {},
  actions: {},
  modules: {
    worker,
    emitter,
  }
})

export default store
