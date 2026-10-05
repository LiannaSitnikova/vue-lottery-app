<script setup lang="ts">
defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  isValid?: boolean;
}>();

defineEmits<{(e: 'update:modelValue', value: string): void}>();
</script>

<template>
  <div class="mb-4">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :type="type || 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        class="w-full pl-3 pr-10 py-2 border rounded text-sm focus:outline-none transition date-input-custom"
        :class="{
          'border-red-500 bg-red-50 focus:border-red-500': error,
          'border-emerald-500 bg-emerald-50': isValid && !error,
          'border-gray-300 focus:border-sky-500': !error && !isValid
        }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span
        v-if="isValid && !error"
        class="absolute right-3 top-2.5 text-emerald-600 pointer-events-none select-none font-bold z-10"
      >
        ✓
      </span>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  margin-right: -15px;
  cursor: pointer;
}
</style>