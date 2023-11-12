<template>
  <div id="channels-container">
    <div v-if="selectedServer" id="nameOfServer">{{ selectedServer.serverName }}</div>

    <!-- Liste des channels -->
    <div v-if="channels.length > 0" id="channels-list">
      <div v-for="channel in channels" :key="channel.id" class="channel-item" ref="channelItems"
           @click="selectChannel(channel)">
        <p>{{ channel.channelName }}</p>
      </div>
    </div>
    <div v-else>
      Aucun channels trouvé.
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChannelsList',
  props: {
    selectedServer: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      channels: [], // Initialiser avec un tableau vide
    };
  },
  mounted() {
    this.fetchChannels();
  },
  watch: {
    selectedServer: 'fetchChannels', // Observer les changements de selectedServer
  },
  methods: {
    async fetchChannels() {
      try {
        if (!this.selectedServer) {
          // Si selectedServer est null, ne faites rien
          return;
        }

        const response = await axios.get('http://127.0.0.1:3000/api/channel/server/' + this.selectedServer.serverId);
        this.channels = response.data;

        this.$nextTick(() => {
          this.handleElements();
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des channels', error);
      }
    },
    handleElements() {
      const channels = this.$refs.channelItems; // Récupérer les éléments du DOM
      if (channels) {
        channels.forEach(channel => {
        });
      }
    },
    selectChannel(channel) {
      // Émettre un événement pour indiquer la sélection du channel
      this.$emit('channelSelected', channel);
    },
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/channelsList';
</style>
