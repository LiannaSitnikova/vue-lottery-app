<script setup lang="ts">
import type { User } from '../types';

defineProps<{ winner: User }>();
defineEmits<{(e: 'remove', id: number): void}>();
</script>

<template>
  <span class="inline-flex items-center bg-sky-500 text-white text-xs px-2.5 py-1 rounded gap-2">
    {{ winner.firstName }} {{ winner.lastName }}
    <button class="font-bold hover:text-red-200 cursor-pointer" @click="$emit('remove', winner.id)">×</button>
  </span>
</template>