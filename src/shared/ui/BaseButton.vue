<script setup lang="ts">
import Button from 'primevue/button';

const props = defineProps<{
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'danger' | 'secondary';
}>();

defineEmits<{(e: 'click', event: MouseEvent): void}>();

const getSeverity = () => {
  if (props.variant === 'danger') return 'danger';
  if (props.variant === 'secondary') return 'secondary';
  return 'primary';
};
</script>

<template>
  <Button
    :type="type || 'button'"
    :disabled="disabled"
    :severity="getSeverity()"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>