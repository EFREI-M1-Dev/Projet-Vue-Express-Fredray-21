<template>
  <div class="card-container">
    <div class="card">
      <h1 class="card-title">Se connecter à Express<span class="color-primary">Chat</span></h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Identifiant</label>
          <input v-model="username" type="text" name="username" class="form-control" required>
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
        <button type="submit" class="btn btn-primary">Connexion</button>
      </form>
      <p>
        Envie de créer un compte ?
        <router-link to="/register">Inscrivez-vous</router-link>
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
      showPassword: false
    };
  },
  methods: {
    login() {
      // Créez un objet contenant les données à envoyer dans la requête POST
      const userData = {
        username: this.username,
        password: this.password,
      };

      // Faites la requête POST à l'URL avec Axios
      axios.post('http://127.0.0.1:3000/api/login', userData, {withCredentials: true, credentials: 'include'})
          .then(response => {

            const token = response.data.token;
            window.localStorage.setItem('token', token);

            this.$router.push('/');
          })
          .catch(error => {
            // Gérez les erreurs ici (par exemple, affichez un message d'erreur)
            console.log("ERROR", error);
          });
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
      const password = document.querySelector('input[name="password"]');
      password.type = this.showPassword ? 'text' : 'password';
    }
  },
  mounted() {
    document.addEventListener('mousemove', (e) => {
      const cursor = document.querySelector('.custom-cursor');

      if (cursor) {
        // Calcul de la vitesse en fonction des déplacements du curseur
        const dx = e.pageX - cursor.offsetLeft;
        const dy = e.pageY - cursor.offsetTop;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // Mise à jour de la position du curseur noir en fonction de la vitesse
        cursor.style.top = e.pageY + 'px';
        cursor.style.left = e.pageX + 'px';

        // Vérifier si le curseur survole un élément de type lien (<a>) ou d'entrée (<input>)
        if (e.target.tagName === 'A' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
          cursor.classList.add('hovered');
        } else {
          cursor.classList.remove('hovered');
        }
      }
    });
  },
};
</script>


<style lang="scss">
@import 'src/styles/pages/loginRegistration';
</style>
