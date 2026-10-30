<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { AppButton, AppInput } from '@/shared/ui';

const emit = defineEmits<{
  (e: 'submit', values: any): void;
  (e: 'cancel'): void;
}>();

const schema = yup.object({
  firstName: yup.string().required('Поле є обов\'язковим'),
  lastName: yup.string().required('Поле є обов\'язковим'),
  email: yup.string().required('Поле є обов\'язковим').email('Некоректний формат email'),
  username: yup.string().required('Поле є обов\'язковим'),
  password: yup.string().required('Поле є обов\'язковим').min(5, 'Мінімум 5 символів'),
  age: yup.string().required('Поле є обов\'язковим'),
  gender: yup.string().required('Поле є обов\'язковим'),
  phone: yup.string().required('Поле є обов\'язковим'),
});

const { handleSubmit, errors, defineField } = useForm({ validationSchema: schema });

const [firstName] = defineField('firstName');
const [lastName] = defineField('lastName');
const [email] = defineField('email');
const [username] = defineField('username');
const [password] = defineField('password');
const [age] = defineField('age');
const [gender] = defineField('gender');
const [phone] = defineField('phone');

const onSubmit = handleSubmit((values) => {
  emit('submit', values);
});
</script>

<template>
  <form @submit="onSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <AppInput v-model="firstName" label="First Name" placeholder="Введіть ім'я" :error="errors.firstName" />
    <AppInput v-model="lastName" label="Last Name" placeholder="Введіть прізвище" :error="errors.lastName" />
    <AppInput v-model="email" label="Email" placeholder="example@mail.com" :error="errors.email" />
    <AppInput v-model="username" label="Username" placeholder="username" :error="errors.username" />
    <AppInput v-model="password" type="password" label="Password" placeholder="••••••••" :error="errors.password" />
    <AppInput v-model="age" type="number" label="Age" placeholder="Вік" :error="errors.age" />
    <AppInput v-model="gender" label="Gender" placeholder="male / female" :error="errors.gender" />
    <AppInput v-model="phone" label="Phone" placeholder="+380..." :error="errors.phone" />

    <div class="md:col-span-2 flex justify-end gap-3 mt-4 border-t dark:border-slate-700 pt-4">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')">
        Скасувати
      </AppButton>
      <AppButton type="submit" variant="primary">
        Зберегти
      </AppButton>
    </div>
  </form>
</template>