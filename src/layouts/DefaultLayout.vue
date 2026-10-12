<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    <main class="flex-1 max-w-6xl w-full mx-auto p-6">
      <router-view />
    </main>
  </div>
</template>