<template>
  <div v-if="isPageReady" className="container">
    <ServersList
        @serverSelected="handleServerSelected"
        @reconnect="handleReconnect"
        :selectedServer="selectedServer"
        class="container__child--servers"
    />
    <div className="container__child">
      <ChannelsList
          :selectedServer="selectedServer"
          :selectedChannel="selectedChannel"
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
          :selectedMember="selectedMember"
          @memberSelected="handleMemberSelected"
          @reconnect="handleReconnect"
          class="container__child--users"
      />
    </div>
  </div>

  <div v-else>
    <Spinner :size="'25px'" />
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {useRouter} from 'vue-router';

import ServersList from '/src/components/Home/ServersList.vue';
import ChannelsList from '/src/components/Home/ChannelsList.vue';
import MessagesList from '/src/components/Home/MessagesList.vue';
import MembersList from '/src/components/Home/MembersList.vue';

import Spinner from '/src/components/Spinner.vue';

const selectedServer = ref(null);
const selectedChannel = ref(null);
const selectedMember = ref(null);
const router = useRouter();
const isPageReady = ref(false);

const handleServerSelected = (server) => {
  selectedServer.value = server;
};

const handleChannelSelected = (channel) => {
  selectedChannel.value = channel;
};

const handleMemberSelected = (member) => {
  console.log(member);
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

const getFirstServer = async () => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    if (!decodedToken) handleReconnect();

    const response = await axios.get(`http://127.0.0.1:3000/api/user/${decodedToken.username}/firstServer`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    handleServerSelected(response.data);
  } catch (error) {
    const code = error.response ? error.response.status : null;
    if (code === 401) handleReconnect();
  }
};

const getFirstChannel = async () => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = jwt.decode(token);
    if (!decodedToken) handleReconnect();

    const response = await axios.get(`http://127.0.0.1:3000/api/server/${selectedServer.value.serverId}/firstChannel`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    handleChannelSelected(response.data);
  } catch (error) {
    const code = error.response ? error.response.status : null;
    if (code === 401) handleReconnect();
  } finally {
    isPageReady.value = true;
  }
};

onMounted(async () => {
  await getFirstServer();
  await getFirstChannel();
});

watch(() => selectedServer.value, async () => {
  await getFirstChannel();
});

</script>

<style lang="scss">
@import 'src/styles/pages/home';
</style>
