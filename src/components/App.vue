<template>
  <div>
    <div v-for="(item, key) in items" :key="key">{{ item.name }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  data() {
    return {
      msg: "Hello world.",
    }
  },
  computed: {
    ...mapState(["roles", "id", "state", "npcs", "items"]),
    title() {
      const role = this.roles[this.id]
      if (role !== undefined) return role.name + " " + this.state + " " + role.server
    },
  },
  watch: {
    title(value) {
      document.title = value
    },
  },
}
</script>
