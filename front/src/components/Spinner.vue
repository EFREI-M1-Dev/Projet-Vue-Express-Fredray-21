<template>
  <div className="spinner">
    <span className="sync" v-bind:style="[spinnerStyle, spinnerDelay1]"></span>
    <span className="sync" v-bind:style="[spinnerStyle, spinnerDelay2]"></span>
    <span className="sync" v-bind:style="[spinnerStyle, spinnerDelay3]"></span>
  </div>
</template>

<script setup>

import { ref, defineProps } from 'vue';

const props = defineProps(['color', 'size', 'margin', 'radius']);

const spinnerStyle = ref({
  backgroundColor: props.color,
  height: props.size,
  width: props.size,
  borderRadius: props.radius,
  margin: props.margin,
  display: 'inline-block',
  animationName: 'spinerAnimation',
  animationDuration: '1.25s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
  animationFillMode: 'both',
});

const spinnerDelay1 = ref({
  animationDelay: '0.07s',
});

const spinnerDelay2 = ref({
  animationDelay: '0.14s',
});

const spinnerDelay3 = ref({
  animationDelay: '0.21s',
});
</script>

<style>
.spinner {
  width           : 100%;
  height          : 100vh;
  display         : flex;
  align-items     : center;
  justify-content : center;
}

@keyframes spinerAnimation {
  33% {
    transform : translateY(10px);
  }
  66% {
    transform : translateY(-10px);
  }
  100% {
    transform : translateY(0);
  }
}
</style>
