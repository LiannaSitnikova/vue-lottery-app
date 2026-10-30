<script setup lang="ts">
import InputText from 'primevue/inputtext';

defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  isValid?: boolean;
}>();

defineEmits<{(e: 'update:modelValue', value: string | number): void}>();
</script>

<template>
  <div class="mb-4 text-left">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <InputText
        :type="type || 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :invalid="!!error"
        class="w-full text-sm p-2 border rounded"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span
        v-if="isValid && !error"
        class="absolute right-3 top-2.5 text-emerald-600 pointer-events-none select-none font-bold z-10"
      >
        ✓
      </span>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1 min-h-[16px]">{{ error }}</p>
  </div>
</template>