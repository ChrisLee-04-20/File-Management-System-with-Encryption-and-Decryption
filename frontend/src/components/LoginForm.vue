<template>
    <form @submit.prevent="handleSubmit">
        <v-container class="mt-10 w-100">
            <h1 class="text-center mb-10">Login</h1>
            <v-row class="d-flex flex-column align-center">
                <v-col cols="12" md="5">
                    <v-text-field v-model="username" :counter="10" label="User name" hide-details type="text"
                        variant="solo" required></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                    <v-text-field v-model="password" :counter="10" label="Password" hide-details type="password"
                        variant="solo" required></v-text-field>
                </v-col>
            </v-row>

            <v-row class="d-flex flex-column align-center">
                <v-col cols="12" md="5">
                    <v-btn class="mt-2" to="/register" block>Register</v-btn>
                </v-col>
            </v-row>
            <v-row class="d-flex flex-column align-center">
                <v-col cols="12" md="5">
                    <v-btn class="mt-2" type="submit" block>Submit</v-btn>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginApi = '/api/users/login';

const username = ref('')
const password = ref('')
const errorMessage = ref(null)

const handleSubmit = async () => {
    const data = {
        'username': username.value,
        'password': password.value
    }

    let response = await fetch(loginApi, {
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(data)
    })

    response = await response.json()

    if (response.error) {
        errorMessage.value = response.error;
        return
    }

    // get the jwt and store it to localstorage
    localStorage.setItem('token', response.token);

    // redirect to the user page
    router.push('/user')

    setTimeout(() => {
        window.location.reload();
    }, 100)

}


</script>