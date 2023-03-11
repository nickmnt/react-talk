<template>
    <div class="min-h-screen bg-white flex items-center justify-center">
        <div class="bg-purple-800 text-white rounded-lg p-4 shadow-lg">
            <p class="font-semibold tracking-wider antialiased">Login:</p>
            <v-text-field class="mt-2" density="compact" label="Email" placeholder="test@example.com"
                name="email">F</v-text-field>
            <router-link to="/login">
                <v-btn>Login</v-btn>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
export default {

}
</script>

<style scoped></style>