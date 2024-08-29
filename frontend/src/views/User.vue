<template>
    <v-container class="w-75 d-flex justify-center align-center">
        <v-card class="mt-10 pa-5 text-center" color="indigo" width="800">
            <v-card-title>
                Welcome {{ username }}!
            </v-card-title>
            <v-card-item class="ma-5 pa-5">
                <v-btn class="w-100" to="/encypt_with_passphrase">Encryption with passphrase</v-btn>
            </v-card-item >
            <v-card-item class="ma-5 pa-5">
                <v-btn class="w-100" to="/decypt_with_passphrase">Decryption with passphrase</v-btn>
            </v-card-item >
            <v-card-item class="ma-5 pa-5">
                <v-btn class="w-100" to="/public_key_generation">Public key generation</v-btn>
            </v-card-item >
            <v-card-item class="ma-5 pa-5">
                <v-btn class="w-100" to="/encypt_with_public_key">Encryption with public key</v-btn>
            </v-card-item >
            <v-card-item class="ma-5 pa-5">
                <v-btn class="w-100" to="/decypt_with_private_key">Decryption with private key</v-btn>
            </v-card-item >
            <v-card-item class="ma-5 pa-5">
                <v-btn class="w-100" to="/all_files">View your files</v-btn>
            </v-card-item >
        </v-card>
    </v-container>

</template>

<script setup>
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";

const username = ref();

const initUserData = () => {
    const token = localStorage.getItem('token')

    if (!token) {
        return
    }

    const data = jwtDecode(token)

    username.value = data.user.username

}

onMounted(() => {
    initUserData();
})

</script>