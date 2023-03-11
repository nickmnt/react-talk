<template>
    <div class="min-h-screen bg-white flex items-center justify-center">
        <div class="bg-blue-900 w-16rem text-white rounded-lg p-4 shadow-lg">
            <p class="font-semibold tracking-wider antialiased">Login:</p>
            <v-text-field class="mt-2" density="compact" label="Email" placeholder="test@example.com" type="email"
                name="email"></v-text-field>
            <v-text-field density="compact" label="Password" type="password" name="password"></v-text-field>
            <div class="flex justify-between w-full">
                <router-link to="/login">
                    <v-btn @click="login">Login</v-btn>
                </router-link>
                <router-link to="/register">
                    <v-btn>No Account?</v-btn>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const login = () => userStore.login({ email: 'bob@test.com', password: 'Pa$$w0rd' });
</script>

<style scoped></style>