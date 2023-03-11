<template>
    <div v-if="!loading" class="min-h-screen bg-white flex items-center justify-center">
        <div class="bg-purple-800 text-white rounded-lg p-4 shadow-lg">
            <p class="font-semibold tracking-wider antialiased">Welcome!</p>
            <p class="antialiased text-xs">This is a vue port of the existing React.js client
                for this
                app.</p>
            <div class="float mt-2">
                <router-link to="/login">
                    <v-btn>Login</v-btn>
                </router-link>
                <v-btn class="ml-2">Register</v-btn>
            </div>
        </div>
    </div>
    <div v-else class="min-h-screen bg-black flex justify-center items-center">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';

const loading = ref(true);

const userStore = useUserStore();
const { token } = storeToRefs(userStore);
console.log(token.value);

if (token.value) {
    userStore.getUser().finally(() => {
        loading.value = false;
    });
} else {
    loading.value = false;
}
</script>