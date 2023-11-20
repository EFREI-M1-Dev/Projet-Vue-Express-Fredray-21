<template>
  <div class="card-container">
    <div class="card">
      <h1 class="card-title">Reconnexion à Express<span class="color-primary">Chat</span></h1>
      <h3>Vous avez été déconnecté suite à une inactivité prolongée.</h3>
      <p>Veuillez vous reconnecter pour continuer à utiliser l'application.</p>
      <button type="button" class="btn" @click="goToLogin">Connexion</button>
      <div class="logo-container">
        <img src="/img/logo.png" alt="Logo" class="logo" />
      </div>
    </div>
  </div>
  <Bubbles />
</template>

<script setup>
import { useRouter } from 'vue-router';
import Bubbles from '/src/components/Bubbles.vue';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<style lang="scss">
@import 'src/styles/pages/auth';
</style>
