<script setup lang="ts">

import {ref} from "vue";
import { UserService } from "@/services/user.service";
const userService = new UserService();

const isMale = ref(true)

const toggleGender = () => {
    isMale.value = !isMale.value
}

const addUser = () => {
    userService.addUser("username","passworD1(","email@email.com")

}

</script>

<template>
  <main>
    <div v-if="isMale" >TU EST MALE</div>
    <div v-else >TU EST FEMELLE</div>

    <button @click="$event => toggleGender()">LE BOUTTON TOGGLE</button>
    <button @click="$event => addUser()">ADD USER</button>

  </main>
</template>
