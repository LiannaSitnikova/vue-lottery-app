<script setup lang="ts">
defineProps<{
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'danger' | 'secondary';
}>();

defineEmits<{(e: 'click'): void}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    class="px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition cursor-pointer"
    :class="{
      'bg-red-500 hover:bg-red-600': variant === 'danger',
      'bg-gray-500 hover:bg-gray-600': variant === 'secondary'
    }"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>