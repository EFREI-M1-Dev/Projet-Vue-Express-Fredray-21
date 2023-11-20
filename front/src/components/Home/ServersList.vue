<template>
  <div id="servers-container">
    <!-- Liste des serveurs -->
    <div v-if="servers.length > 0" id="server-list">
      <div
          v-for="server in servers"
          :key="server.serverId"
          class="server-item"
          ref="serverItems"
          @click="selectServer(server)"
          :class="{ 'server-item_selected': server.serverId === selectedServer.serverId }"
      >
        <img v-if="server.icon == null" src="/img/logo.png" />
        <img v-else :src="server.icon" />

        <div class="server-name">{{ server.serverName }}</div>
        <!-- Vous pouvez ajouter d'autres détails du serveur ici -->
      </div>
    </div>
    <div v-else>
      Aucun serveur trouvé.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const props = defineProps({
  selectedServer: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['reconnect', 'serverSelected']);

const servers = ref([]);

const fetchServers = async () => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    // Si le token n'est pas valide, rediriger vers la page de reconnexion
    if (!decodedToken) emit('reconnect');

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
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
  }
};

const handleElements = () => {
  const serverItems = document.getElementsByClassName('server-item');
  if (serverItems) {
    Array.from(serverItems).forEach((server) => {
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
  emit('serverSelected', server);
};

onMounted(() => {
  fetchServers();
});
</script>

<style lang="scss">
@import 'src/styles/components/serversList';
</style>
