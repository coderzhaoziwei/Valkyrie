<template>
<div id="left" class="order-1 flex-shrink-0 flex-grow-0 h-full hidden md:flex flex-col break-words overflow-auto p-1 text-xs">
  <div v-for="(text, index) in textList" :key="index" v-html="text"></div>
  <div id="text-list-bottom"></div>
</div>
</template>

<script>
import Vue from "vue"
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters([
      "textList",
    ]),
  },
  watch: {
    // 滚动到底部
    textList: {
      deep: true,
      async handler() {
        await Vue.nextTick()
        // if (document.getElementById("text-list-bottom").offsetWidth > 0)
        document.getElementById("text-list-bottom").scrollIntoView({ behavior: "smooth" })
      },
    },
  },
}
</script>
