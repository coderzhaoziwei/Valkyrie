<template>
  <div>
    <teleport to="body">
      <Left></Left>
    </teleport>
    <teleport to="body">
      <Right></Right>
    </teleport>
    <teleport to="#text-list">
      <TextList></TextList>
    </teleport>
  </div>
</template>

<script>
import { defineComponent } from "vue"
// import { mapGetters } from "vuex"
import Left from "./Left.vue"
import Right from "./Right.vue"
import TextList from "./TextList.vue"

export default defineComponent({
  name: "App",
  data() {
    return {}
  },
  computed: {},
  watch: {},
})

// export default {
//   components: {
//     Left,
//     Right,
//     TextList,
//   },
//   data() {
//     return {}
//   },
//   computed: {
//     // ...mapGetters([
//     //   "documentTitle",
//     //   "roomName",
//     //   "textList",
//     // ]),
//   },
//   watch: {
//     // documentTitle(value) {
//     //   document.title = value
//     // },
//   },
// }
</script>
