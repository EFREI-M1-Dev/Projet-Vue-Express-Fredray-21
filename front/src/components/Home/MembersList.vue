<template>
  <div id="members-container">
    <div v-if="members.length > 0" id="member-list">
      <div v-for="member in members" :key="member.id" class="member-item" ref="memberItems" @click="selectMember(member)">
        <img v-if="member.icon == null" src="/img/logo.png" style="width: 50px; height: 50px" />
        <img v-else :src="member.icon"/>
        <div class="member-name">{{ member.username }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps(['selectedServer']);
const emit = defineEmits(['reconnect', 'memberSelected']);

const members = ref([]);

const fetchMembers = async () => {
  try {
    if (!props.selectedServer) return;

    const token = localStorage.getItem("token");
    const response = await axios.get(`http://127.0.0.1:3000/api/server/${props.selectedServer.serverId}/users`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    members.value = response.data;

  } catch (error) {
    const code = error.response ? error.response.status : null;
    if (code === 401) emit('reconnect');
    console.error('Erreur lors de la récupération des members', error);
  }
};

const selectMember = (member) => {
  emit('memberSelected', member);
};

onMounted(fetchMembers);
watch(() => props.selectedServer, fetchMembers);

</script>

<style lang="scss">
@import 'src/styles/components/channelsList';
</style>
