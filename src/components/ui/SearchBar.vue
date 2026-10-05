<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{(e: 'filter-by-name', query: string): void}>();
const search = ref('');
let timeoutId: ReturnType<typeof setTimeout>;

watch(search, (val) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    emit('filter-by-name', val);
  }, 300);
});
</script>

<template>
  <div class="mb-4">
    <input
      v-model="search"
      type="text"
      placeholder="Пошук за іменем..."
      class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-sky-500"
    />
  </div>
</template>