<template>
  <div id="messages-container">
    <div id="container-info-server">
      <div class="container-info-server">
        <img src="http://fakeimg.pl/300/" alt="AvatarServer" class="container-info-server__avatar">
        <div class="container-info-server__text">
          <span class="container-info-server__text-server">
            <font-awesome-icon :icon="'hashtag'"/>
            {{ channelName }}
          </span>
          <span class="container-info-server__text-sub">{{ serverName }} | {{
              nbUsers
            }} membre{{ nbUsers > 1 ? "s" : "" }}</span>
        </div>
      </div>
      <div class="container-info-server__btns">
        <button class="container-info-server__btns-btn">
          <font-awesome-icon :icon="'user-plus'"/>
        </button>
        <button class="container-info-server__btns-btn">
          <font-awesome-icon :icon="'cog'"/>
        </button>
        <button class="container-info-server__btns-btn">
          <font-awesome-icon :icon="'users'"/>
        </button>
      </div>
    </div>
    <div v-if="messages.length > 0" id="messages-list" ref="messagesList">
      <div
          v-for="message in messages"
          :key="message.id"
          :class="{ 'message-item_me': message.isCurrentUser }"
          class="message-item" ref="messageItems"
      >
        <img v-if="!message.isCurrentUser" src="http://fakeimg.pl/300/" alt="Avatar" class="message-item__avatar">
        <div class="message-item__content">
          <div class="message-item__content-txt">
            {{ message.content }}

            <div v-if="message.isCurrentUser" class="message-item__options">
              <button class="message-item__options-btn" :data-msgId="message.messageId"
                      @click="toggleOptions(message.messageId)">
                <font-awesome-icon :icon="'ellipsis'"/>
              </button>

              <div v-if="message.isCurrentUser" class="message-item__options-content" :data-msgId="message.messageId">
                <button class="message-item__options-content-btn message-item__options-content-btn-del"
                        @click="deleteMsg(message.messageId)">
                  <font-awesome-icon :icon="'trash'"/>
                  del
                </button>

                <button class="message-item__options-content-btn">
                  <font-awesome-icon :icon="'edit'"/>
                  edit
                </button>
              </div>

            </div>
          </div>
          <div class="message-item__content-info">
            <span>{{ message.owner.username }}</span>
            <span>{{ formatMessageDate(message.creationDate) }}</span>
          </div>


        </div>
        <img v-if="message.isCurrentUser" src="http://fakeimg.pl/300/" alt="Avatar" class="message-item__avatar">
      </div>
    </div>
    <div v-else id="messages-list">
      <div class="message-item-empty">
        <div>Aucun message</div>
      </div>
    </div>
    <div id="message-input-container">
      <input type="text" id="message-input" ref="messageInput" :placeholder="`Envoyer un message dans #${channelName}`"
             class="message-input">
      <button id="message-send" class="message-send" @click="sendMsg">
        <font-awesome-icon :icon="'paper-plane'"/>
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch, nextTick, defineProps, defineEmits} from 'vue';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import {gestionKeyBoard} from '/src/script/gestionKeyBoard';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps(['selectedServer', 'selectedChannel']);
const emit = defineEmits(['reconnect']);

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
const username = decodedToken?.username ?? null;
if (!username) emit('reconnect');
const isCurrentUser = (message) => {
  return message.owner.username === username;
};

const sendMsg = async () => {
  const valueContent = messageInput.value.value;
  if (!valueContent || valueContent.length === 0 || valueContent.trim().length === 0) return;
  try {
    const token = localStorage.getItem("token");
    await axios.post(
        `http://127.0.0.1:3000/api/message/`,
        {
          owner: {username: username},
          content: valueContent,
          channel: {channelId: props.selectedChannel.channelId},
          server: {serverId: props.selectedServer.serverId},
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

const deleteMsg = async (messageId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
        `http://127.0.0.1:3000/api/message/${messageId}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
          data: {
            owner: {username: username},
            content: messageInput.value.value,
            channel: {channelId: props.selectedChannel.channelId},
            server: {serverId: props.selectedServer.serverId},
          },
        });
  } catch (error) {
    const code = error.response ? error.response.status : null;
    if (code === 401) emit("reconnect");
    console.error("Erreur lors de la suppression du message:", error);
  } finally {
    if (messageInput.value) messageInput.value.value = "";
    await fetchMessages();

    await nextTick();
    scrollToBottom();
  }
};

const toggleOptions = (messageId) => {
  const allBtns = document.querySelectorAll(`.message-item__options-btn`);
  allBtns.forEach((btn) => {
    if (Number(btn.dataset.msgid) !== messageId) {
      btn.style.transform = 'rotate(0deg)';
    } else {
      btn.style.transform = btn.style.transform === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)';
    }
  });

  const allOptions = document.querySelectorAll(`.message-item__options-content`);
  allOptions.forEach((option) => {
    if (Number(option.dataset.msgid) !== messageId) {
      option.style.display = 'none';
    } else {
      option.style.display = option.style.display === 'flex' ? 'none' : 'flex';
    }
  });
};


const {addKeyboardListener, removeKeyboardListener} = gestionKeyBoard(sendMsg);

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

</script>

<style lang="scss">
@import 'src/styles/components/messagesList';
</style>
