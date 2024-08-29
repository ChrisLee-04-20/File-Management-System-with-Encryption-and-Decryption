<template>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <v-container class="mt-10 w-100">
            <h1 class="text-center mb-10">Decrypt and upload file with private key</h1>
            <v-row class="d-flex flex-column align-center">
                <v-col cols="12" md="5">
                    <v-textarea v-model="privateKey" :counter="10" label="Private Key" hide-details type="text" bg-color="red-darken-2"
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

const passphraseFileUploadApi = '/api/public_key_decrypt'

const privateKey = ref();
const file = ref();

const message = ref();
const errorMessage = ref();

const handleSubmit = async () => {

    const fileData = file.value;

    let formData = new FormData();
    formData.append('uploaded_file', fileData[0])
    formData.append('privateKey', privateKey.value)

    console.log(formData.get('uploaded_file'))
    console.log(formData.get('privateKey'))

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

    const blob = new Blob([response.decryptedContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = response.fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

}
</script>