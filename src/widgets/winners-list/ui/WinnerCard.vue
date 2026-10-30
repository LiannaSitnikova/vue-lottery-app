<script setup lang="ts">
import type { User } from '@/entities/user';
import { AppButton } from '@/shared/ui';

defineProps<{ winner: User }>();
defineEmits<{(e: 'remove', id: number): void}>();
</script>

<template>
  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-100 dark:border-slate-600 transition-colors">
    <div>
      <p class="font-semibold text-sm text-gray-800 dark:text-gray-100">{{ winner.firstName }} {{ winner.lastName }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ winner.email }}</p>
    </div>
    <AppButton
      variant="danger"
      @click="$emit('remove', winner.id)"
    >
      ✕
    </AppButton>
  </div>
</template>