<template>
    <v-container class="d-flex justify-center align-center flex-column">
        <v-card class="mt-10" width="800">
            <v-card-title>Your files:</v-card-title>

            <div v-if="files.length > 0">
                <v-card-item v-for="file, index in files" :key="file">
                    {{ index + 1 }}. {{ file }}
                </v-card-item>
            </div>

            <div v-else class="ma-10">
                <v-card-item class="text-h5 text-center">Does not have any files.</v-card-item>
            </div>

        </v-card>

        <div v-if="errorMessage" class="mt-10">
            <span class="text-red">Error: {{ errorMessage }}</span>
        </div>

    </v-container>

</template>

<script setup>
import { onMounted, ref } from "vue"

const api = '/api/users/files'
const files = ref([]);

const errorMessage = ref();

const getUserFiles = async () => {
    let response = await fetch(api);

    response = await response.json();

    if (response.error) {
        errorMessage.value = response.error;
        return
    }

    files.value = response.files;

}

onMounted(() => {
    getUserFiles();
})

</script>