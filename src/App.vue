<script setup lang="ts">
import { AppToast, AppConfirmDialog } from '@/shared/ui';
</script>

<template>
  <AppToast />
  <AppConfirmDialog />
  <router-view />
</template>