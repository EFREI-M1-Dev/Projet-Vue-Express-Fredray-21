<template>
  <div class="card-container">
    <div class="card">
      <h1 class="card-title">Reconnexion à <span class="color-primary">Chat</span></h1>
      <h3>Vous avez été déconnecté suite à une inactivité prolongée.</h3>
      <p>Veuillez vous reconnecter pour continuer à utiliser l'application.</p>
      <button type="button" class="btn" @click="goToLogin">Connexion</button>
      <div class="logo-container">
        <img src="/img/logo.png" alt="Logo" class="logo" />
      </div>
    </div>
  </div>
  <section class="sticky">
    <div class="bubbles">
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'Reconnection',
  setup() {
        const router = useRouter();

        const goToLogin = () => {
          router.push('/login');
        };
    return {
      goToLogin
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/pages/auth';
</style>
