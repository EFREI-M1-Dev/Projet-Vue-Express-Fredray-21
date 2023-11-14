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
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export default {
  name: 'ServersList',
  setup(props, { emit }) {
    const servers = ref([]);

    const fetchServers = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwt.decode(token);

        const response = await axios.get(`http://127.0.0.1:3000/api/user/${decodedToken.username}/servers`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        servers.value = response.data;

        nextTick(() => {
          handleElements();
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des serveurs', error);
      }
    };

    const handleElements = () => {
      const serverItems = document.getElementsByClassName('server-item');
      if (serverItems) {
        Array.from(serverItems).forEach(server => {
          server.addEventListener('mouseenter', () => {
            server.querySelector('.server-name').style.display = 'block';
          });

          server.addEventListener('mouseleave', () => {
            server.querySelector('.server-name').style.display = 'none';
          });
        });
      }
    };

    const selectServer = (server) => {
      // Émettre un événement pour indiquer la sélection du serveur
      emit('serverSelected', server);
    };

    // Lifecycle hooks
    onMounted(fetchServers);

    return {
      servers,
      selectServer,
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/serversList';
</style>
