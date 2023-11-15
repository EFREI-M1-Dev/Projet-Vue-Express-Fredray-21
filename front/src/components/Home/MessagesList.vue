<template>
  <div id="messages-container">
    <!-- Liste des messages -->

    <div v-if="messages.length > 0" id="messages-list">
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
      <div class="message-item">
        <div class="message-item__content">
          <div class="message-item__content-txt">Aucun message</div>
        </div>
      </div>
    </div>

    <div id="message-input-container">
      <input type="text" id="message-input" placeholder="Message" class="message-input">
      <button id="message-send" class="message-send">
        <font-awesome-icon :icon="'paper-plane'" />
      </button>
    </div>



  </div>
</template>

<script>
import {ref, onMounted, watch, nextTick} from 'vue';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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

    onMounted(fetchMessages);
    watch([() => props.selectedServer, () => props.selectedChannel], fetchMessages);

    const decodedToken = jwt.decode(token);
    const isCurrentUser = (message) => {
      return message.owner.username === decodedToken.username;
    };

    return {
      messages,
      formatMessageDate,
      isCurrentUser
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/messagesList';
</style>
