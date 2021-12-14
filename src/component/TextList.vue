<template>
<div id="left" class="order-1 flex-shrink-0 flex-grow-0 h-full flex flex-col break-words overflow-auto p-1 text-xs">
  <pre v-for="(text, index) in textList" :key="index" v-html="text"></pre>
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
    textList: {
      async handler() {
        await Vue.nextTick()
        // 滚动到底部
        document.getElementById("text-list-bottom").scrollIntoView({ behavior: "smooth" })
      },
      deep: true,
    },
  },
}
</script>
