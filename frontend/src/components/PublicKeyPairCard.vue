<template>
    <form @submit.prevent="generatePublicKeyPair">
        <v-container class="mt-10 w-100">
            <h1 class="text-center mb-10">Generate Public Key Pair</h1>
            <v-row class="d-flex flex-column align-center">
                <v-col cols="12" md="5">
                    <v-textarea v-model="publicKey" label="Public Key" variant="solo" bg-color="deep-purple-darken-1" auto-grow ></v-textarea>
                </v-col>
                <v-col cols="12" md="5">
                    <v-textarea v-model="privateKey" label="Private Key" variant="solo" bg-color="red-darken-2"  ></v-textarea>
                </v-col>
            </v-row>

            <v-row class="d-flex flex-column align-center">
                <v-col cols="12" md="5">
                    <v-btn class="mt-2" type="submit" block>Regenerate</v-btn>
                </v-col>
            </v-row>

            <v-row class="d-flex flex-column align-center" v-if="message">
                <v-col cols="12" md="5">
                    <span class="text-green">
                        {{ message }}
                    </span>
                </v-col>
            </v-row>

            <v-row class="d-flex flex-column align-center" v-if="errorMessage">
                <v-col cols="12" md="5">
                    <span class="text-red">
                        {{ errorMessage }}
                    </span>
                </v-col>
            </v-row>

        </v-container>
    </form>
</template>

<script setup>
import { onMounted, ref } from "vue";

const api = '/api/generate_public_key';

const publicKey = ref();
const privateKey = ref();

const errorMessage = ref();

const generatePublicKeyPair = async () => {

    let response = await fetch(api);

    response = await response.json();

    if (response.error) {
        errorMessage.value = response.error;
        return
    }

    publicKey.value = response.publicKey;
    privateKey.value = response.privateKey;
    
}

onMounted(() => {
    generatePublicKeyPair();
})
</script>