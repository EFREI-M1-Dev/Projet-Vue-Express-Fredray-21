<template>
  <div id="servers-container">
    <div v-if="servers.length > 0" id="server-list" @wheel="handleScroll">
      <div
          v-for="server in servers"
          :key="server.serverId"
          class="server-item"
          ref="serverItems"
          @click="selectServer(server)"
          :class="{ 'server-item_selected': server.serverId === selectedServer.serverId }"
          :data-server-name="server.serverName"
      >
        <img v-if="server.icon == null" src="/img/logo.png"/>
        <img v-else :src="server.icon"/>
      </div>
    </div>
    <div v-else>
      Aucun serveur trouvé.
    </div>
  </div>

</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue';
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

  } catch (error) {
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
  }
};

const selectServer = (server) => {
  emit('serverSelected', server);
};

// Ajoutez la gestion du défilement
const handleScroll = (event) => {
  const serverList = document.getElementById('server-list');
  serverList.scrollLeft -= event.deltaY;
};

onMounted(() => {
  fetchServers();
});
</script>

<style lang="scss">
@import 'src/styles/components/serversList';
</style>
