<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <hello-world msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<script setup lang="ts">
// https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/hello-world.vue'

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
