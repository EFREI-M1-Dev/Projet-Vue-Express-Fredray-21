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
  data() {
    return {
      messages: [], // Initialiser avec un tableau vide
    };
  },
  mounted() {
    this.fetchMessages();
  },
  watch: {
    selectedChannel: 'fetchMessages', // Observer les changements de selectedChannel
    selectedServer: 'fetchMessages', // Observer les changements de selectedChannel
  },
  methods: {
    async fetchMessages() {
      try {
        if (!this.selectedServer || !this.selectedChannel) {
          // Si selectedServer est null ou selectedChannel est null, ne faites rien
          return;
        }

        const response = await axios.get(`http://127.0.0.1:3000/api/message/server/${this.selectedServer.serverId}/channel/${this.selectedChannel.channelId}`);
        this.messages = response.data;


        this.$nextTick(() => {
          this.handleElements();
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des channels', error);
      }
    },
    handleElements() {
      const messages = this.$refs.messageItems; // Récupérer les éléments du DOM
      if (messages) {
        messages.forEach(channel => {
        });
      }
    },
    // selectChannel(channel) {
    //   // Émettre un événement pour indiquer la sélection du channel
    //   this.$emit('channelSelected', channel);
    // },
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/channelsList';
</style>
