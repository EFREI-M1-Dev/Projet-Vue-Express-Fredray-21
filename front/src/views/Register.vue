<template>
  <div class="card-container">
    <div class="card">
      <h1 class="card-title">Rejoignez Express<span class="color-primary">Chat</span></h1>
      <form @submit.prevent="registration">
        <div class="form-group">
          <label for="username">Identifiant</label>
          <input v-model="username" type="text" name="username" class="form-control" required autofocus>
          <p class="infoUsername">
            Il s'agit du nom par lequel les autres utilisateurs vous verront.
            <br>
            Vous pourrez toujours le modifier plus tard.
          </p>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-container">
            <input v-model="email" type="email" name="email" class="form-control" required>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="input-container">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" name="password" class="form-control" required>
            <i class="iconPassword" @click="togglePasswordVisibility">
              <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'"/>
            </i>
          </div>
        </div>
        <button type="submit" class="btn">Inscription</button>
      </form>

      <p>
        Vous utilisez déjà ExpressChat ?
        <router-link to="/login">Connexion</router-link>
      </p>
      <div class="logo-container">
        <img src="/img/logo.png" alt="Logo" class="logo">
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
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'Registration',
  setup() {
    const username = ref('');
    const password = ref('');
    const email = ref('');
    const showPassword = ref(false);
    const router = useRouter();

    const registration = () => {
      const userData = {
        username: username.value,
        email: email.value,
        password: password.value,
      };

      axios.post('http://127.0.0.1:3000/api/user/', userData)
          .then(response => {
            console.log(response.data);
            router.push('/');
          })
          .catch(error => {
            console.error('Error:', error.response.data.message);
          });
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
      const passwordInput = document.querySelector('input[name="password"]');
      if (passwordInput) {
        passwordInput.type = showPassword.value ? 'text' : 'password';
      }
    };

    return {
      username,
      password,
      email,
      showPassword,
      registration,
      togglePasswordVisibility
    };
  },
  mounted() {
    const usernameInput = document.querySelector('input[name="username"]');
    usernameInput.addEventListener('input', (e) => {
      const usernameValue = e.target.value;
      const input = document.querySelector('[name="username"]');
      const containerInfo = document.querySelector(".infoUsername");
      const defaultValueInfo = "Il s'agit du nom par lequel les autres utilisateurs vous verront. <br> Vous pourrez toujours le modifier plus tard."

      if (usernameValue.length > 3) {
        axios.get('http://127.0.0.1:3000/api/user/username/'+ usernameValue)
            .then(response => {
              response.data ? input.style.border = "2px solid red" : input.style.border = "1px solid #e0e0e0";
              response.data ? containerInfo.innerHTML="*Cet identifiant est indisponible" : containerInfo.innerHTML=defaultValueInfo;
              response.data ? containerInfo.style.color="red" : containerInfo.style.color="#808080";
            })
            .catch(error => {
              console.log("ERROR", error);
            });
      } else {
        input.style.border = "2px solid red";
        containerInfo.innerHTML="*L’identifiant doit faire entre 4 et 25 caractères.";
        containerInfo.style.color="red";
      }
    });
  },
};
</script>

<style lang="scss">
@import 'src/styles/pages/auth';
</style>
