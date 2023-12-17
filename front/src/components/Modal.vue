<template>
  <div id="modal">
    <div class="modalContainer">
      <div class="modalContainer__title">
        <slot name="Title"></slot>
        <button class="modalContainer__title--close" aria-label="close" @click="close"> &times; </button>
      </div>

      <slot></slot>

      <div class="modalContainer__inputs">
        <slot name="inputs"></slot>
      </div>

    </div>
  </div>


</template>

<script setup>
const props = defineProps(['close']);
const close = () =>  props.close();

</script>

<style lang="scss">
@import 'src/styles/components/modal';
</style>
