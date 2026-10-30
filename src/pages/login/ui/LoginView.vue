<script setup lang="ts">
import { LoginForm } from '@/features/auth';
</script>

<template>
  <div class="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md max-w-md mx-auto transition-colors">
    <h2 class="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
      Авторизація
    </h2>
    
    <LoginForm />
  </div>
</template>