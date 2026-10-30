<script setup lang="ts">
import type { User } from '@/entities/user';
import { AppButton } from '@/shared/ui';
import WinnerCard from './WinnerCard.vue';

defineProps<{
  winners: User[];
  canSelectNewWinner: boolean;
}>();

defineEmits<{
  (e: 'new-winner'): void;
  (e: 'remove-winner', id: number): void;
}>();
</script>

<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm mb-8 transition-colors">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">Переможці лотереї:</h2>
        <span v-if="winners.length === 0" class="text-sm text-gray-400 italic">Ще немає переможців</span>
      </div>

      <AppButton
        variant="primary"
        :disabled="!canSelectNewWinner"
        @click="$emit('new-winner')"
      >
        New winner
      </AppButton>
    </div>

    <div v-if="winners.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <WinnerCard
        v-for="winner in winners"
        :key="winner.id"
        :winner="winner"
        @remove="$emit('remove-winner', $event)"
      />
    </div>
  </div>
</template>