<template>
  <div id="channels-container">


    <!-- Liste des channels -->
    <div v-if="channels.length > 0" id="channels-list">
      <div v-for="channel in channels" :key="channel.id" class="channel-item" ref="channelItems"
           @click="selectChannel(channel)">

        <div class="channel-item__icon">ICON</div>
        <span class="channel-item__name">{{ channel.channelName }}</span>

      </div>
    </div>
    <div v-else>
      Aucun channels trouvé.
    </div>
  </div>
</template>

<script>
import {ref, onMounted, watch, nextTick} from 'vue';
import axios from 'axios';

export default {
  name: 'ChannelsList',
  props: {
    selectedServer: {
      type: Object,
      default: null,
    },
  },
  setup(props, {emit}) {
    const channels = ref([]);

    const fetchChannels = async () => {
      try {
        if (!props.selectedServer) {
          // Si selectedServer est null, ne faites rien
          return;
        }

        const response = await axios.get('http://127.0.0.1:3000/api/channel/server/' + props.selectedServer.serverId);
        channels.value = response.data;

        nextTick(() => {
          handleElements();
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des channels', error);
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
      // Émettre un événement pour indiquer la sélection du channel
      emit('channelSelected', channel);
    };

    onMounted(fetchChannels);
    watch(() => props.selectedServer, fetchChannels);

    return {
      channels,
      selectChannel,
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/channelsList';
</style>
