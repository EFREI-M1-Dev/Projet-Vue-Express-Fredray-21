<template>
  <div id="servers-container">
    <div id="icon-home">
      <img src="/img/logo.png" />
    </div>

    <!-- Liste des serveurs -->
    <div v-if="servers.length > 0" id="server-list">
      <div v-for="server in servers" :key="server.id" class="server-item" ref="serverItems" @click="selectServer(server)">
        <img v-if="server.icon == null" src="/img/logo.png" />
        <img v-else :src="server.icon" />

        <div class="server-name">
          {{ server.serverName }}
        </div>
        <!-- Vous pouvez ajouter d'autres détails du serveur ici -->
      </div>
    </div>
    <div v-else>
      Aucun serveur trouvé.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jwt from "jsonwebtoken";



export default {
  name: 'ServersList',
  data() {
    return {
      servers: [], // Initialiser avec un tableau vide
    };
  },
  mounted() {
    this.fetchServers();


  },
  methods: {
    async fetchServers() {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwt.decode(token);

        const response = await axios.get('http://127.0.0.1:3000/api/server/user/'+ decodedToken.username, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        this.servers = response.data; // Met à jour la liste des serveurs dans les données du composant

        // $nextTick pour garantir que le rendu est terminé
        this.$nextTick(() => {
          this.handleElements(); // Appeler la méthode pour ajouter les écouteurs d'événements
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des serveurs', error);
      }
    },
    handleElements() {
      const servers = this.$refs.serverItems;
      if (servers) {
        servers.forEach(server => {
          server.addEventListener('mouseenter', () => {
            server.querySelector('.server-name').style.display = 'block';
          });

          server.addEventListener('mouseleave', () => {
            server.querySelector('.server-name').style.display = 'none';
          });
        });
      }
    },
    selectServer(server) {
      // Émettre un événement pour indiquer la sélection du serveur
      this.$emit('serverSelected', server);
    },
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/serversList';
</style>
