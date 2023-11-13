<template>
  <div class="container">
    <ServersList @serverSelected="handleServerSelected"/>
    <ChannelsList :selectedServer="selectedServer" @channelSelected="handleChannelSelected"/>

    <MessagesList :selectedServer="selectedServer" :selectedChannel="selectedChannel"/>

    <MembersList :selectedServer="selectedServer" :selectedChannel="selectedChannel"
                 @memberSelected="handleMemberSelected"/>
  </div>
</template>

<script>
import ServersList from '/src/components/Home/ServersList.vue';
import ChannelsList from '/src/components/Home/ChannelsList.vue';
import MessagesList from '/src/components/Home/MessagesList.vue';
import MembersList from '/src/components/Home/MembersList.vue';

export default {
  name: 'Home',
  components: {
    ServersList,
    ChannelsList,
    MessagesList,
    MembersList,
  },
  data() {
    return {
      selectedServer: null,
      selectedChannel: null,
      MessagesList: null,
      selectedMember: null,
    };
  },
  methods: {
    handleServerSelected(server) {
      this.selectedServer = server;
    },
    handleChannelSelected(channel) {
      this.selectedChannel = channel;
    },
    handleMemberSelected(member) {
      this.selectedMember = member;
    },
  },
};
</script>

<style lang="scss">
@import 'src/styles/pages/home';
</style>
