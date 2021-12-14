<template>
<div id="right" class="order-3 flex-shrink-0 flex-grow-0 h-full hidden md:flex flex-col break-words overflow-auto p-1 text-xs">
  <div v-for="(chat, index) in chatList" :key="index">
    <div>{{ chat.content }}</div>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters([
      "chatList",
    ]),
  },

}
</script>
