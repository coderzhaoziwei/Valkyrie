import { createStore } from "vuex"

import mutations from "./mutations"
import actions from "./actions"


const store = createStore({
  state () {
    return {
      count: 0,
    }
  },
  mutations,
  actions,
})

export default store
