<script setup lang="ts">
import type { User } from '@/entities/user';
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
  <div class="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center border border-gray-100">
    <div class="flex items-center gap-2 flex-wrap">
      <span class="font-semibold text-gray-700 mr-2 text-sm">Переможці лотереї:</span>
      <span v-if="winners.length === 0" class="text-xs text-gray-400 italic">Ще немає переможців</span>
      <WinnerCard
        v-for="winner in winners"
        :key="winner.id"
        :winner="winner"
        @remove="$emit('remove-winner', $event)"
      />
    </div>
    <button 
      :disabled="!canSelectNewWinner" 
      @click="$emit('new-winner')"
      class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer text-sm font-medium shadow-sm">
      New winner
    </button>
  </div>
</template>