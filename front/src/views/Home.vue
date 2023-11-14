<template>
  <div className="container">
    <ServersList @serverSelected="handleServerSelected" />
    <div class="container__child" >
      <ChannelsList :selectedServer="selectedServer" @channelSelected="handleChannelSelected" class="container__child--channels" />
      <MessagesList :selectedServer="selectedServer" :selectedChannel="selectedChannel" class="container__child--chat"/>
      <MembersList
          :selectedServer="selectedServer"
          :selectedChannel="selectedChannel"
          @memberSelected="handleMemberSelected"
          class="container__child--users"
      />
    </div>
  </div>
</template>

<script>
import {ref} from 'vue';
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
  setup() {
    const selectedServer = ref(null);
    const selectedChannel = ref(null);
    const selectedMember = ref(null);

    const handleServerSelected = (server) => {
      selectedServer.value = server;
    };

    const handleChannelSelected = (channel) => {
      selectedChannel.value = channel;
    };

    const handleMemberSelected = (member) => {
      selectedMember.value = member;
    };

    return {
      selectedServer,
      selectedChannel,
      selectedMember,
      handleServerSelected,
      handleChannelSelected,
      handleMemberSelected,
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/pages/home';
</style>
