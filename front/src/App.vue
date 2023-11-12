<template>
  <div id="app">
    <router-view></router-view>
    <div class="custom-cursor"></div>
  </div>
</template>

<style lang="scss">
@import './styles/main';
</style>

<script>
import initializeCustomCursor from "./script/customCursor"

export default {
  name: 'App',
  mounted() {
    initializeCustomCursor();
  }
}
</script>

