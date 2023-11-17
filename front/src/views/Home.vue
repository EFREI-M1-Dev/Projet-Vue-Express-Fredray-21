<template>
  <div className="container">
    <ServersList
        @serverSelected="handleServerSelected"
        @reconnect="handleReconnect"
        class="container__child--servers"
    />
    <div class="container__child">
      <ChannelsList
          :selectedServer="selectedServer"
          @channelSelected="handleChannelSelected"
          @reconnect="handleReconnect"
          class="container__child--channels"
      />
      <MessagesList
          :selectedServer="selectedServer"
          :selectedChannel="selectedChannel"
          @reconnect="handleReconnect"
          class="container__child--chat"
      />
      <MembersList
          :selectedServer="selectedServer"
          :selectedChannel="selectedChannel"
          @memberSelected="handleMemberSelected"
          @reconnect="handleReconnect"
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
import { useRouter } from 'vue-router';

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
    const router = useRouter();


    const handleServerSelected = (server) => {
      selectedServer.value = server;
    };

    const handleChannelSelected = (channel) => {
      selectedChannel.value = channel;
    };

    const handleMemberSelected = (member) => {
      selectedMember.value = member;
    };

    const handleLogout = () => {
      window.localStorage.removeItem('token');
      router.push('/login');
    };

    const handleReconnect = () => {
      window.localStorage.removeItem('token');
      router.push('/reconnection');
    };

    return {
      selectedServer,
      selectedChannel,
      selectedMember,
      handleServerSelected,
      handleChannelSelected,
      handleMemberSelected,
      handleLogout,
      handleReconnect
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/pages/home';
</style>
