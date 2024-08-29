<template>
  <v-app-bar flat class="bg-blue">
    <v-app-bar-title>
      <span class="d-flex justify-space-between">
        <span>
          <v-icon icon="mdi-folder" />
          <span class="ml-5">File Management System</span>
        </span>
        <v-btn class="bg-red mr-5" v-if="isLoggedIn" @click="handleLogout">Logout</v-btn>
      </span>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const isLoggedIn = ref(null);

const router = useRouter();

const handleLogout = () => {
  localStorage.clear();
  isLoggedIn.value = null
  router.push('/login');
}

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn.value = true
  }

})

</script>
