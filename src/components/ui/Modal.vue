<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{(e: 'close'): void}>();

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div class="text-lg font-bold mb-4">
          <slot name="header" />
        </div>
        <div class="mb-6">
          <slot name="body" />
        </div>
        <div class="flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>