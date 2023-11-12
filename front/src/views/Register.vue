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
          <label for="password">Email</label>
          <div class="input-container">
            <input v-model="email" type="email" name="email" class="form-control" required>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="input-container">
            <input v-model="password" type="password" name="password" class="form-control" required>
            <i class="iconPassword" @click="togglePasswordVisibility">
              <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'"/>
            </i>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Inscription</button>
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
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      email: '',
      showPassword: false,
    };
  },
  methods: {
    registration() {
      // Créez un objet contenant les données à envoyer dans la requête POST
      const userData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };


      // Faites la requête POST à l'URL avec Axios
      axios.post('http://127.0.0.1:3000/api/user/', userData)
          .then(response => {

            console.log(response.data);
            this.$router.push('/');
          })
          .catch(error => {
            // Gérez les erreurs ici (par exemple, affichez un message d'erreur)
            console.log("ERROR", error.response.data.message);
          });
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
      const password = document.querySelector('input[name="password"]');
      password.type = this.showPassword ? 'text' : 'password';
    }
  },
  mounted() {
    const usernameInput = document.querySelector('input[name="username"]');
    usernameInput.addEventListener('input', (e) => {
      const username = e.target.value;
      const input = document.querySelector('[name="username"]');
      const containerInfo = document.querySelector(".infoUsername");
      const defaultValueInfo = "Il s'agit du nom par lequel les autres utilisateurs vous verront. <br> Vous pourrez toujours le modifier plus tard."

      if (username.length > 3) {
        axios.get('http://127.0.0.1:3000/api/user/username/'+ username)
            .then(response => {

              response.data ? input.style.border = "2px solid red" : input.style.border = "1px solid #e0e0e0";
              response.data ? containerInfo.innerHTML="*Cet identifiant est indisponible" : containerInfo.innerHTML=defaultValueInfo;
              response.data ? containerInfo.style.color="red" : containerInfo.style.color="#808080";
            })
            .catch(error => {
              // Gérez les erreurs ici (par exemple, affichez un message d'erreur)
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
@import 'src/styles/pages/loginRegistration';
</style>
