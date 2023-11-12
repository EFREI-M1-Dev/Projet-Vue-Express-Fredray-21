<template>
  <div class="container">
    <ServersList @serverSelected="handleServerSelected"/>
    <ChannelsList :selectedServer="selectedServer" @channelSelected="handleChannelSelected"/>

    <div id="messages-container">
      Messages
    </div>

    <div id="users-container">
      Users
    </div>
  </div>
</template>

<script>
import ServersList from '/src/components/Home/ServersList.vue';
import ChannelsList from '/src/components/Home/ChannelsList.vue';

export default {
  name: 'Home',
  components: {
    ServersList,
    ChannelsList,
  },
  data() {
    return {
      selectedServer: null,
      selectedChannel: null,
    };
  },
  methods: {
    handleServerSelected(server) {
      this.selectedServer = server;
    },
    handleChannelSelected(channel) {
      this.selectedChannel = channel;
    },
  },
};
</script>

<style lang="scss">
@import 'src/styles/pages/home';
</style>
