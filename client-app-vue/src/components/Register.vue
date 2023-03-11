<template>
    <div class="min-h-screen bg-white flex items-center justify-center">
        <div class="bg-blue-900 w-16rem text-white rounded-lg p-4 shadow-lg">
            <p class="font-semibold tracking-wider antialiased">Register:</p>
            <v-text-field class="mt-2" density="compact" label="Display Name" placeholder="Josh" type="text"
                name="displayname"></v-text-field>
            <v-text-field density="compact" label="Username" placeholder="test@example.com" type="text"
                name="username"></v-text-field>
            <v-text-field density="compact" label="Email" placeholder="test@example.com" type="email"
                name="email"></v-text-field>
            <v-text-field density="compact" label="Password" type="password" name="password"></v-text-field>
            <div class="flex justify-between w-full">
                <v-btn>Sign up</v-btn>
                <router-link to="/login">
                    <v-btn>Login Page</v-btn>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {

}
</script>

<style scoped></style>