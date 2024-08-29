<template>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <v-container class="mt-10 w-100">
            <h1 class="text-center mb-10">Encrypt and upload file with public key</h1>
            <v-row class="d-flex flex-column align-center">
                <v-col cols="12" md="5">
                    <v-textarea v-model="publicKey" :counter="10" label="Public Key" hide-details type="text" bg-color="deep-purple-darken-1"
                        variant="solo" required></v-textarea>
                </v-col>
                <v-col cols="12" md="5">
                    <v-file-input v-model="file" label="File input" variant="solo" type="file" name="file"
                        required></v-file-input>
                </v-col>
            </v-row>

            <v-row class="d-flex flex-column align-center">
                <v-col cols="12" md="5">
                    <v-btn class="mt-2" type="submit" block>Submit</v-btn>
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
import { ref } from "vue"

const passphraseFileUploadApi = '/api/public_key_encrypt'

const publicKey = ref();
const file = ref();

const message = ref();
const errorMessage = ref();

const handleSubmit = async () => {

    const fileData = file.value;

    let formData = new FormData();
    formData.append('uploaded_file', fileData[0])
    formData.append('publicKey', publicKey.value)

    console.log(formData.get('uploaded_file'))
    console.log(formData.get('publicKey'))

    let response = await fetch(passphraseFileUploadApi, {
        method: 'POST',
        body: formData
    })

    response = await response.json()

    if (response.error) {
        errorMessage.value = response.error;
        return
    }

    message.value = response.message;
    errorMessage.value = null;

}
</script>