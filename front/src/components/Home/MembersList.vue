<template>
  <div id="members-container">
    <!-- Liste des members -->
    <div v-if="members.length > 0" id="member-list">
      <div v-for="member in members" :key="member.id" class="member-item" ref="memberItems"
           @click="selectMember(member)">
        <img v-if="member.icon == null" src="/img/logo.png" style="width: 50px; height: 50px" />
        <img v-else :src="member.icon"/>

        <div class="member-name">
          {{ member.username }}
        </div>
        <!-- Vous pouvez ajouter d'autres détails du member ici -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue';
import axios from 'axios';

export default {
  name: 'MembersList',
  props: {
    selectedServer: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const members = ref([]);

    const fetchMembers = async () => {
      try {
        if (!props.selectedServer) {
          // Si selectedServer est null, ne faites rien
          return;
        }

        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:3000/api/server/${props.selectedServer.serverId}/users`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        members.value = response.data; // Met à jour la liste des serveurs dans les données du composant

        nextTick(() => {
          handleElements();
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des members', error);
      }
    };

    const handleElements = () => {
      const memberItems = document.getElementsByClassName('member-item');
      if (memberItems) {
        Array.from(memberItems).forEach(member => {
          // Handle individual member item if needed
        });
      }
    };

    const selectMember = (member) => {
      // Émettre un événement pour indiquer la sélection du member
      emit('memberSelected', member);
    };

    onMounted(fetchMembers);
    watch(() => props.selectedServer, fetchMembers);

    return {
      members,
      selectMember,
    };
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/channelsList';
</style>
