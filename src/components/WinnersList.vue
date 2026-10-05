<script setup lang="ts">
import type { Participant } from '../types';
import WinnerCard from './WinnerCard.vue';
import BaseButton from './ui/BaseButton.vue';

defineProps<{
  winners: Participant[];
  canSelectNewWinner: boolean;
}>();

defineEmits<{
  (e: 'new-winner'): void;
  (e: 'remove-winner', id: string): void;
}>();
</script>

<template>
  <div class="bg-white p-4 rounded shadow mb-6 flex justify-between items-center">
    <div class="flex items-center gap-2 flex-wrap">
      <span class="font-semibold text-gray-500 mr-2">Winners</span>
      <WinnerCard
        v-for="winner in winners"
        :key="winner.id"
        :winner="winner"
        @remove="$emit('remove-winner', $event)"
      />
    </div>
    <BaseButton :disabled="!canSelectNewWinner" @click="$emit('new-winner')">
      New winner
    </BaseButton>
  </div>
</template>