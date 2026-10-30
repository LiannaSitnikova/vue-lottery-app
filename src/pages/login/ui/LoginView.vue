<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useSessionStore } from '@/entities/session';
import { useRouter, useRoute } from 'vue-router';
import { AppButton, AppInput } from '@/shared/ui';

const sessionStore = useSessionStore();
const router = useRouter();
const route = useRoute();
const serverError = ref('');

const schema = yup.object({
  username: yup.string().required('Обов\'язкове поле'),
  password: yup.string().min(5, 'Мінімум 5 символів').required('Обов\'язкове поле'),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: { username: 'emilys', password: 'emilyspass' },
});

const [username] = defineField('username');
const [password] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  serverError.value = '';
  try {
    await sessionStore.login(values.username, values.password);
    const redirectPath = (route.query.redirect as string) || '/users';
    router.push(redirectPath);
  } catch (e: any) {
    serverError.value = 'Помилка авторизації. Перевірте логін та пароль.';
  }
});
</script>

<template>
  <div class="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md max-w-md mx-auto transition-colors">
    <h2 class="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Авторизація</h2>
    
    <form @submit="onSubmit">
      <AppInput
        v-model="username"
        label="Username"
        type="text"
        :error="errors.username"
      />

      <AppInput
        v-model="password"
        label="Password"
        type="password"
        :error="errors.password"
      />

      <p v-if="serverError" class="text-xs text-red-500 text-center mb-3">{{ serverError }}</p>

      <AppButton type="submit" variant="primary" class="w-full">
        Login
      </AppButton>
    </form>
  </div>
</template>