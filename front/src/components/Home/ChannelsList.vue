<template>
  <div id="channels-container">
    <div id="channels-container--add">
      <button type="button" @click="openModalAddChannel">
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

          <button type="button" class="channel-item__icon__close"
                  v-if="selectedChannel && channel.channelId === selectedChannel.channelId"
                  @click="openModalEditChannel">
            <font-awesome-icon :icon="'pen'"/>
          </button>
        </div>
        <span class="channel-item__name">{{ channel.channelName }}</span>
      </div>
    </div>
    <div v-else>
      Aucun channels trouvé.
    </div>

    <Modal v-if="modalAddChannel" :close="closeModalAddChannel">
      <template v-slot:Title>
        <span>Créer un salon</span>
      </template>
      <template v-slot:inputs>
        <button type="button" @click="closeModalAddChannel">Cancel</button>
        <button type="button" @click="addChannel()">Confirm</button>
      </template>
      <input type="text" placeholder="Nom du salon" v-model="channelName">
    </Modal>

    <Modal v-if="modalEditChannel" :close="closeModalEditChannel">
      <template v-slot:Title>
        <span>Modifier le salon #{{ selectedChannel.channelName }}</span>
      </template>
      <template v-slot:inputs>
        <button type="button" @click="deleteChannel">Delete channel</button>
        <button type="button" @click="closeModalEditChannel">Cancel</button>
        <button type="button" @click="editChannel">Confirm</button>
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

const modalEditChannel = ref(false);

const openModalEditChannel = () => {
  modalEditChannel.value = true;
  channelName.value = props.selectedChannel.channelName;
};

const closeModalEditChannel = () => {
  modalEditChannel.value = false;
};

const openModalAddChannel = () => {
  modalAddChannel.value = true;
};

const closeModalAddChannel = () => {
  modalAddChannel.value = false;
};


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

const editChannel = async () => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    if (!decodedToken) emit('reconnect');

    await axios.put(`http://127.0.0.1:3000/api/channel/${props.selectedChannel.channelId}`,
        {
          channelName: channelName.value,
          description: props.selectedChannel.description,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        }).then((response) => {
      selectChannel(response.data);
      channelName.value = response.data.channelName;
    })
  } catch (error) {
    console.error('Erreur lors de la modification du channel', error);
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
  } finally {
    await fetchChannels();
    closeModalEditChannel();
  }
};

const addChannel = async () => {
  try {
    if (!channelName.value || channelName.value.trim() === '') return;
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
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
      selectChannel(response.data);
    })

  } catch (error) {
    console.error('Erreur lors de la création du channel', error);
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
  } finally {
    modalAddChannel.value = false;
    await fetchChannels();
    channelName.value = '';
  }
};

const deleteChannel = async () => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    if (!decodedToken) emit('reconnect');

    await axios.delete(`http://127.0.0.1:3000/api/channel/${props.selectedChannel.channelId}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      }
    }).then(() => {
      selectDefaultChannel();
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du channel', error);
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
  } finally {
    await fetchChannels();
    closeModalEditChannel();
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
