<template>
  <div class="card-container">
    <div class="card">
      <h1 class="card-title">Se connecter à Express<span class="color-primary">Chat</span></h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Identifiant</label>
          <input v-model="username" type="text" name="username" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="input-container">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" name="password" class="form-control" required />
            <i class="iconPassword" @click="togglePasswordVisibility">
              <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" />
            </i>
          </div>
        </div>
        <button type="submit" class="btn">Connexion</button>
      </form>
      <p>
        Envie de créer un compte ?
        <router-link to="/register">Inscrivez-vous</router-link>
      </p>
      <div class="logo-container">
        <img src="/img/logo.png" alt="Logo" class="logo" />
      </div>
    </div>
  </div>
  <Bubbles />
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Bubbles from '/src/components/Bubbles.vue';

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const router = useRouter();

const login = async () => {
  const userData = {
    username: username.value,
    password: password.value,
  };

  try {
    const response = await axios.post('http://127.0.0.1:3000/api/login', userData, {
      withCredentials: true,
      credentials: 'include',
    });

    const token = response.data.token;
    await window.localStorage.setItem('token', token);

    // Now that the token is set, you can redirect the user
    await router.push('/');
  } catch (error) {
    console.error('Error:', error);
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
  const passwordInput = document.querySelector('input[name="password"]');
  if (passwordInput) {
    passwordInput.type = showPassword.value ? 'text' : 'password';
  }
};
</script>

<style lang="scss">
@import 'src/styles/pages/auth';
</style>
