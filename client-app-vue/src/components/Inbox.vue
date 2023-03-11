<template>
    <div class="bg-white flex items-center justify-center">
        <div class="w-1/4 min-h-screen bg-blue">WTF</div>
        <div class="w-3/4 min-h-screen bg-red">NO</div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const login = () => userStore.login({ email: 'bob@test.com', password: 'Pa$$w0rd' });
</script>

<style scoped></style>