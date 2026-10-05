<script setup lang="ts">
import { reactive } from 'vue';
import type { Participant } from '../types';
import BaseInput from './ui/BaseInput.vue';
import BaseButton from './ui/BaseButton.vue';

const props = defineProps<{ participants: Participant[] }>();
const emit = defineEmits<{(e: 'add-participant', p: Omit<Participant, 'id'>): void}>();

const form = reactive({ name: '', birthDate: '', email: '', phone: '' });
const errors = reactive({ name: '', birthDate: '', email: '', phone: '' });

const resetErrors = () => {
  errors.name = '';
  errors.birthDate = '';
  errors.email = '';
  errors.phone = '';
};

const validate = (): boolean => {
  resetErrors();
  let valid = true;

  if (!form.name.trim()) {
    errors.name = 'This value is required';
    valid = false;
  }

  if (!form.birthDate) {
    errors.birthDate = 'This value is required';
    valid = false;
  } else if (new Date(form.birthDate) > new Date()) {
    errors.birthDate = 'Дата народження не може бути у майбутньому';
    valid = false;
  }

  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = 'This value is required';
    valid = false;
  } else if (!emailRegexp.test(form.email)) {
    errors.email = 'Некоректний Email';
    valid = false;
  } else if (props.participants.some(p => p.email.toLowerCase() === form.email.trim().toLowerCase())) {
    errors.email = 'Учасник з таким Email вже існує';
    valid = false;
  }

  const phoneRegexp = /^\+380\d{9}$/;
  if (!form.phone) {
    errors.phone = 'This value is required';
    valid = false;
  } else if (!phoneRegexp.test(form.phone)) {
    errors.phone = 'Формат повинен бути +380XXXXXXXXX';
    valid = false;
  }

  return valid;
};

const handleSubmit = () => {
  if (validate()) {
    emit('add-participant', {
      name: form.name.trim(),
      birthDate: form.birthDate,
      email: form.email.trim(),
      phone: form.phone.trim()
    });
    form.name = '';
    form.birthDate = '';
    form.email = '';
    form.phone = '';
    resetErrors();
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded shadow mb-6" @keyup.enter="handleSubmit">
    <h2 class="text-lg font-bold text-gray-800">REGISTER FORM</h2>
    <p class="text-xs text-gray-400 mb-4">Please fill in all the fields.</p>

    <form @submit.prevent="handleSubmit">
      <BaseInput v-model="form.name" label="Name" placeholder="Enter user name" :error="errors.name" :is-valid="!!form.name && !errors.name" />
      <BaseInput v-model="form.birthDate" label="Date of Birth" type="date" :error="errors.birthDate" :is-valid="!!form.birthDate && !errors.birthDate" />
      <BaseInput v-model="form.email" label="Email" placeholder="Enter email" :error="errors.email" :is-valid="!!form.email && !errors.email" />
      <BaseInput v-model="form.phone" label="Phone number" placeholder="+380XXXXXXXXX" :error="errors.phone" :is-valid="!!form.phone && !errors.phone" />

      <div class="flex justify-end">
        <BaseButton type="submit">Save</BaseButton>
      </div>
    </form>
  </div>
</template>