<template>
  <div id="messages-container">
    <!-- Liste des messages -->
    <div v-if="messages.length > 0" id="messages-list">
      <div v-for="message in messages" :key="message.id" class="message-item" ref="messageItems">
        <p>{{ message.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue';
import axios from 'axios';

export default {
  name: 'MessagesList',
  props: {
    selectedServer: {
      type: Object,
      default: null,
    },
    selectedChannel: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const messages = ref([]);

    const fetchMessages = async () => {
      try {
        if (!props.selectedServer || !props.selectedChannel) {
          // Si selectedServer est null ou selectedChannel est null, ne faites rien
          return;
        }
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:3000/api/message/server/${props.selectedServer.serverId}/channel/${props.selectedChannel.channelId}`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        messages.value = response.data;

        nextTick(() => {
          handleElements();
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des channels', error);
      }
    };

    const handleElements = () => {
      const messageItems = document.getElementsByClassName('message-item');
      if (messageItems) {
        Array.from(messageItems).forEach(message => {
          // Handle individual message item if needed
        });
      }
    };

    // Lifecycle hooks
    onMounted(fetchMessages);
    watch([() => props.selectedServer, () => props.selectedChannel], fetchMessages);

    return {
      messages,
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/channelsList';
</style>
