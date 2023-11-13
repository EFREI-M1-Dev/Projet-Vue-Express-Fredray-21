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
import axios from 'axios';

export default {
  name: 'MembersList',
  props: {
    selectedServer: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      members: [], // Initialiser avec un tableau vide
    };
  },
  mounted() {
    this.fetchMembers();
  },
  watch: {
    selectedServer: 'fetchMembers', // Observer les changements de selectedServer
  },
  methods: {
    async fetchMembers() {
      try {
        if (!this.selectedServer) {
          // Si selectedServer est null, ne faites rien
          return;
        }

        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:3000/api/server/${this.selectedServer.serverId}/users`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        this.members = response.data; // Met à jour la liste des serveurs dans les données du composant

        this.$nextTick(() => {
          this.handleElements();
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des members', error);
      }
    },
    handleElements() {
      const members = this.$refs.memberItems; // Récupérer les éléments du DOM
      if (members) {
        members.forEach(member => {
        });
      }
    },
    selectMember(member) {
      // Émettre un événement pour indiquer la sélection du channel
      this.$emit('memberSelected', member);
    },
  },
};
</script>

<style lang="scss">
@import 'src/styles/components/channelsList';
</style>
