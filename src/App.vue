<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Participant } from './types';
import WinnersList from './components/WinnersList.vue';
import RegisterForm from './components/RegisterForm.vue';
import ParticipantsTable from './components/ParticipantsTable.vue';

const participants = ref<Participant[]>([]);
const winnerIds = ref<string[]>([]);

onMounted(() => {
  const saved = localStorage.getItem('lottery_participants');
  if (saved) {
    try {
      participants.value = JSON.parse(saved);
    } catch (e) {
      console.error('Помилка завантаження даних:', e);
    }
  }
});

watch(
  participants,
  (newVal) => {
    localStorage.setItem('lottery_participants', JSON.stringify(newVal));
  },
  { deep: true }
);

const addParticipant = (data: Omit<Participant, 'id'>) => {
  participants.value.push({
    ...data,
    id: Date.now().toString()
  });
};

const updateParticipant = (updated: Participant) => {
  const idx = participants.value.findIndex(p => p.id === updated.id);
  if (idx !== -1) {
    participants.value[idx] = updated;
  }
};

const deleteParticipant = (id: string) => {
  participants.value = participants.value.filter(p => p.id !== id);
  winnerIds.value = winnerIds.value.filter(wId => wId !== id);
};

const winners = computed(() => {
  return participants.value.filter(p => winnerIds.value.includes(p.id));
});

const canSelectNewWinner = computed(() => {
  if (winnerIds.value.length >= 3) return false;
  const availableCount = participants.value.length - winnerIds.value.length;
  return availableCount > 0;
});

const handleNewWinner = () => {
  const available = participants.value.filter(p => !winnerIds.value.includes(p.id));
  if (available.length > 0 && winnerIds.value.length < 3) {
    const idx = Math.floor(Math.random() * available.length);
    winnerIds.value.push(available[idx].id);
  }
};

const handleRemoveWinner = (id: string) => {
  winnerIds.value = winnerIds.value.filter(wId => wId !== id);
};
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <WinnersList
      :winners="winners"
      :can-select-new-winner="canSelectNewWinner"
      @new-winner="handleNewWinner"
      @remove-winner="handleRemoveWinner"
    />

    <RegisterForm
      :participants="participants"
      @add-participant="addParticipant"
    />

    <ParticipantsTable
      :participants="participants"
      @update-participant="updateParticipant"
      @delete-participant="deleteParticipant"
    />
  </div>
</template>