<template>
    <div class="min-h-screen bg-white flex items-center justify-center">
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
</template>
<script lang="ts">
export default {

}
</script>