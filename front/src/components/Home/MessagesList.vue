<template>
  <div id="messages-container">
    <div id="container-info-server">
      <div class="container-info-server">
        <img src="http://fakeimg.pl/300/" alt="AvatarServer" class="container-info-server__avatar">
        <div class="container-info-server__text">
          <span class="container-info-server__text-server">{{ channelName }}</span>
          <span class="container-info-server__text-sub">{{ serverName }} | {{ nbUsers }} membres</span>
        </div>
      </div>
      <div class="container-info-server__btns">
        <button class="container-info-server__btns-btn">
          <font-awesome-icon :icon="'user-plus'"/>
        </button>
        <button class="container-info-server__btns-btn">
          <font-awesome-icon :icon="'cog'"/>
        </button>
        <button class="container-info-server__btns-btn" >
          <font-awesome-icon :icon="'users'"/>
        </button>
      </div>
    </div>
    <!-- Liste des messages -->
    <div v-if="messages.length > 0" id="messages-list" ref="messagesList">
      <div v-for="message in messages" :key="message.id" :class="{ 'message-item_me': message.isCurrentUser }"
           class="message-item" ref="messageItems">
        <img v-if="!message.isCurrentUser" src="http://fakeimg.pl/300/" alt="Avatar" class="message-item__avatar">
        <div class="message-item__content">
          <div class="message-item__content-txt">{{ message.content }}</div>
          <div class="message-item__content-info">
            <span>{{ message.owner.username }}</span>
            <span>{{ formatMessageDate(message.creationDate) }}</span>
          </div>
        </div>
        <img v-if="message.isCurrentUser" src="http://fakeimg.pl/300/" alt="Avatar" class="message-item__avatar">
      </div>
    </div>
    <!-- Aucun message -->
    <div v-else id="messages-list">
      <div class="message-item-empty">
          <div>Aucun message</div>
      </div>
    </div>
    <div id="message-input-container">
      <input type="text" id="message-input" ref="messageInput" :placeholder="`Envoyer un message dans #${channelName}`" class="message-input">
      <button id="message-send" class="message-send" @click="sendMsg">
        <font-awesome-icon :icon="'paper-plane'" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { gestionKeyBoard } from '/src/script/gestionKeyBoard';

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
  setup(props, { emit }) {
    const messages = ref([]);
    const serverName = ref(null);
    const nbUsers = ref(null);
    const channelName = ref('');

    const messagesList = ref(null);
    const messageInput = ref(null);

    const scrollToBottom = () => {
      const messagesListRef = messagesList.value;
      if (messagesListRef) {
        messagesListRef.scrollTop = messagesListRef.scrollHeight;
      }
    };

    const formatMessageDate = (creationDate) => {
      const today = new Date();
      const messageDate = new Date(creationDate);
      if (
          today.getDate() === messageDate.getDate() &&
          today.getMonth() === messageDate.getMonth() &&
          today.getFullYear() === messageDate.getFullYear()
      ) {
        const hours = messageDate.getHours();
        const minutes = messageDate.getMinutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      } else {
        const day = messageDate.getDate();
        const month = messageDate.getMonth() + 1;
        const year = messageDate.getFullYear();
        return `${day}/${month}/${year}`;
      }
    };

    const token = localStorage.getItem("token");

    const fetchMessages = async () => {
      try {
        if (!props.selectedServer || !props.selectedChannel) {
          return;
        }
        const response = await axios.get(`http://127.0.0.1:3000/api/message/server/${props.selectedServer.serverId}/channel/${props.selectedChannel.channelId}`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        messages.value = response.data;

        messages.value = messages.value.map((message) => ({
          ...message,
          isCurrentUser: isCurrentUser(message),
        }));

        await nextTick();
        scrollToBottom();
      } catch (error) {
        const code = error.response ? error.response.status : null;
        if (code === 401) emit('reconnect');
        console.error('Erreur lors de la récupération des channels', error);
      }
    };

    const fetchNbUsers = async () => {
      try {
        if (!props.selectedServer || props.selectedServer.serverId === 'me') {
          return;
        }
        const response = await axios.get(`http://127.0.0.1:3000/api/server/${props.selectedServer.serverId}/users/count`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        nbUsers.value = response.data;
      } catch (error) {
        const code = error.response ? error.response.status : null;
        if (code === 401) emit('reconnect');
        console.error('Erreur lors de la récupération des users', error);
      }
    };

    const updateServerName = () => {
      serverName.value = props.selectedServer ? props.selectedServer.serverName : null;
      if (!serverName.value) emit('reconnect');
    };

    const updateChannelName = () => {
      channelName.value = props.selectedChannel ? props.selectedChannel.channelName : null;
      if (!channelName.value) emit('reconnect');

      if (!channelName.value) console.log(props.selectedChannel);
    };

    const decodedToken = jwt.decode(token);
    const isCurrentUser = (message) => {
      return message.owner.username === decodedToken.username;
    };


    const sendMsg = async () => {
      const valueContent = messageInput.value.value;
      if (!valueContent || valueContent.length === 0 || valueContent.trim().length === 0) return;
      try {
        const token = localStorage.getItem("token");
        await axios.post(
            `http://127.0.0.1:3000/api/message/`,
            {
              owner: { username: decodedToken.username },
              content: valueContent,
              channel: { channelId: props.selectedChannel.channelId },
              server: { serverId: props.selectedServer.serverId },
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
        );
      } catch (error) {
        const code = error.response ? error.response.status : null;
        if (code === 401) emit("reconnect");
        console.error("Erreur lors de l'envoi du message:", error);
      } finally {
        if (messageInput.value) messageInput.value.value = "";
        await fetchMessages();

        await nextTick();
        scrollToBottom();
      }
    };

    const { addKeyboardListener, removeKeyboardListener } = gestionKeyBoard(sendMsg);

    onMounted(() => {
      fetchMessages();
      updateServerName();
      fetchNbUsers();
      updateChannelName();
      addKeyboardListener();
    });

    onBeforeUnmount(() => {
      removeKeyboardListener();
    });

    watch(() => props.selectedServer, async () => {
      updateServerName();
      await fetchNbUsers();
      await fetchMessages();
    });

    watch(() => props.selectedChannel, async () => {
      await fetchMessages();
      updateChannelName();
    });

    return {
      messages,
      formatMessageDate,
      isCurrentUser,
      sendMsg,
      serverName,
      channelName,
      nbUsers,
      messagesList,
      messageInput,
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/messagesList';
</style>
