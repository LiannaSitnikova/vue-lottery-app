<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useAuthStore } from '../stores/auth.store';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
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

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  serverError.value = '';
  try {
    await authStore.login(values.username, values.password);
    const redirectPath = (route.query.redirect as string) || '/users';
    router.push(redirectPath);
  } catch (e: any) {
    serverError.value = 'Помилка авторизації. Перевірте логін та пароль.';
  }
});
</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-6 text-center">Авторизація</h2>
    <form @submit="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
        <input v-model="username" v-bind="usernameAttrs" type="text" class="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-sky-500" />
        <span class="text-xs text-red-500">{{ errors.username }}</span>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <input v-model="password" v-bind="passwordAttrs" type="password" class="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-sky-500" />
        <span class="text-xs text-red-500">{{ errors.password }}</span>
      </div>

      <p v-if="serverError" class="text-xs text-red-500 text-center">{{ serverError }}</p>

      <button type="submit" class="w-full py-2 bg-sky-500 text-white font-medium rounded hover:bg-sky-600 transition cursor-pointer">
        Login
      </button>
    </form>
  </div>
</template>