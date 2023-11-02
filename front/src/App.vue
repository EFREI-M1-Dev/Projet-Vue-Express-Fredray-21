<template>
  <div>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username">
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      const { username, password } = this;
      console.log(username, password);

      // Send a POST request to the login endpoint with username and password
      // Handle the response to check if the login was successful
    },
  },
};
</script>
