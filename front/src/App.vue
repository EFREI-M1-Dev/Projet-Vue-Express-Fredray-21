<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import './styles/main';
</style>

<script>
import { gestionKeyBoard } from './script/gestionKeyBoard';

export default {
  name: 'App',
  components: {
  },
  setup() {
    gestionKeyBoard();
  },
}
</script>

