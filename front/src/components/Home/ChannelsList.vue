<template>
  <div id="channels-container">
    <div id="channels-container--add">
      <button type="button" @click="modalAddChannel = true">
        <font-awesome-icon :icon="'plus'"/>
      </button>
    </div>
    <div v-if="channels.length > 0" id="channels-list">
      <div
          v-for="channel in channels"
          :key="channel.channelId"
          class="channel-item"
          ref="channelItems"
          @click="selectChannel(channel)"
          :class="{ 'channel-item_selected': selectedChannel && channel.channelId === selectedChannel.channelId}"
      >
        <div class="channel-item__icon">
          <font-awesome-icon :icon="'hashtag'"/>
        </div>
        <span class="channel-item__name">{{ channel.channelName }}</span>
      </div>
    </div>
    <div v-else>
      Aucun channels trouvé.
    </div>

    <Modal v-if="modalAddChannel" :close="() => modalAddChannel = false">
      <template v-slot:Title>
        <span>Créer un salon</span>
      </template>
      <template v-slot:inputs>
        <button type="button" @click="() => modalAddChannel = false">Cancel</button>
        <button type="button" @click="addChannel()">Confirm</button>
      </template>
      <input type="text" placeholder="Nom du salon" v-model="channelName">
    </Modal>

  </div>
</template>

<script setup>
import {ref, onMounted, watch, nextTick, defineProps, defineEmits} from 'vue';
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import Modal from '/src/components/Modal.vue';
import jwt from 'jsonwebtoken';

const props = defineProps(['selectedServer', 'selectedChannel']);
const emit = defineEmits(['reconnect', 'channelSelected']);

const channels = ref([]);
const modalAddChannel = ref(false);
const channelName = ref('');
const token = localStorage.getItem("token");

const fetchChannels = async () => {
  try {
    if (!props.selectedServer) return;

    const response = await axios.get(`http://127.0.0.1:3000/api/channel/server/${props.selectedServer.serverId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    channels.value = response.data;

    nextTick(() => {
      handleElements();
    });
  } catch (error) {
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
    console.error('Erreur lors de la récupération des channels', error);
  }
};

const selectDefaultChannel = () => {
  if (channels.value.length > 0) {
    const defaultChannel = channels.value[0];
    selectChannel(defaultChannel);
  }
};

const handleElements = () => {
  const channelItems = document.getElementsByClassName('channel-item');
  if (channelItems) {
    Array.from(channelItems).forEach(channel => {
      // Handle individual channel item if needed
    });
  }
};

const selectChannel = (channel) => {
  emit('channelSelected', channel);
};


const addChannel = async () => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    // Si le token n'est pas valide, rediriger vers la page de reconnexion
    if (!decodedToken) emit('reconnect');

    await axios.post(`http://127.0.0.1:3000/api/channel/`,
        {
          channelName: channelName.value,
          server: props.selectedServer,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        }).then((response) => {
      selectChannel(response.data)
    })

  } catch (error) {
    console.error('Erreur lors de la création du channel', error);
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
  } finally {
    modalAddChannel.value = false;
    await fetchChannels();
  }
};


onMounted(fetchChannels);
watch(() => props.selectedServer, () => {
  fetchChannels();
  selectDefaultChannel();
});

</script>

<style lang="scss">
@import 'src/styles/components/channelsList';
</style>
