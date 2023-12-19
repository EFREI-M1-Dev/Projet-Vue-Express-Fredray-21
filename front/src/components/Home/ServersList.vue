<template>
  <div id="servers-container">
    <div v-if="servers.length > 0" id="server-list" @wheel="handleScroll">
      <div
          v-for="server in servers"
          :key="server.serverId"
          class="server-item"
          ref="serverItems"
          @click="selectServer(server)"
          :class="{'server-item_selected': server.serverId === selectedServer.serverId }"
          :data-server-name="server.serverName"
      >
        <img v-if="server.imageUrl != null" :src="'http://localhost:3000/images/' + server.imageUrl" />
        <img v-else src="http://fakeimg.pl/300/"/>
      </div>

      <div
          class="server-item add-server"
          @click="() => modalAddServeur = true"
      >
        <div class="add-server-icon">
          <font-awesome-icon :icon="'plus'"/>
        </div>
      </div>
    </div>

    <div id="user-info">
      <h1>{{ username }}</h1>
      <img src="http://fakeimg.pl/300/"/>
    </div>

    <Modal v-if="modalAddServeur" :close="() => modalAddServeur = false">
      <template v-slot:Title>
        <span>Créer un serveur</span>
      </template>
      <template v-slot:inputs>
        <button type="button" @click="() => modalAddServeur = false">Cancel</button>
        <button type="button" @click="createServer()">Confirm</button>
      </template>
      <input type="text" placeholder="Nom du serveur" v-model="serveurName">
    </Modal>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import Modal from '/src/components/Modal.vue';

const modalAddServeur = ref(false);
const serveurName = ref('');

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

const handleScroll = (event) => {
  const serverList = document.getElementById('server-list');
  serverList.scrollLeft += event.deltaY;
};

const token = localStorage.getItem('token');
const decodedToken = jwt.decode(token);
if (!decodedToken) emit('reconnect');
const username = decodedToken?.username ?? null;
if (!username) emit('reconnect');

const createServer = async () => {
  try {
    if (!serveurName.value || serveurName.value.trim() === '') return;
    await axios.post(`http://127.0.0.1:3000/api/server/`,
        {
          serverName: serveurName.value,
          owner: {username: username},
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }).then((response) => {
      selectServer(response.data);
    });
  } catch (error) {
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
  } finally {
    modalAddServeur.value = false;
    await fetchServers();
  }
};

onMounted(() => {
  fetchServers();
});

watch(() => props.selectedServer, async () => {
  await fetchServers();
});

watch(() => props.selectedServer.imageUrl, async () => {
  await fetchServers();
});

</script>

<style lang="scss">
@import 'src/styles/components/serversList';
</style>
