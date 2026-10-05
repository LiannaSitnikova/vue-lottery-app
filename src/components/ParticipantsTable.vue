<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Participant, SortField, SortOrder } from '../types';
import SearchBar from './ui/SearchBar.vue';
import Modal from './ui/Modal.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';

const props = defineProps<{ participants: Participant[] }>();
const emit = defineEmits<{
  (e: 'update-participant', p: Participant): void;
  (e: 'delete-participant', id: string): void;
}>();

const searchQuery = ref('');
const sortField = ref<SortField>('name');
const sortOrder = ref<SortOrder>('asc');

const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedParticipant = ref<Participant | null>(null);

const editForm = ref({ name: '', birthDate: '', email: '', phone: '' });
const editErrors = ref({ name: '', birthDate: '', email: '', phone: '' });

const filteredAndSortedParticipants = computed(() => {
  let result = [...props.participants];

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter(p => p.name.toLowerCase().includes(q));
  }

  result.sort((a, b) => {
    let fieldA = a[sortField.value].toLowerCase();
    let fieldB = b[sortField.value].toLowerCase();
    if (fieldA < fieldB) return sortOrder.value === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });

  return result;
});

const handleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const openEditModal = (p: Participant) => {
  selectedParticipant.value = { ...p };
  editForm.value = { ...p };
  editErrors.value = { name: '', birthDate: '', email: '', phone: '' };
  isEditModalOpen.value = true;
};

const validateEdit = (): boolean => {
  let valid = true;
  editErrors.value = { name: '', birthDate: '', email: '', phone: '' };

  if (!editForm.value.name.trim()) {
    editErrors.value.name = 'Обов\'язкове поле';
    valid = false;
  }
  if (!editForm.value.birthDate) {
    editErrors.value.birthDate = 'Обов\'язкове поле';
    valid = false;
  }

  const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!editForm.value.email || !emailRegexp.test(editForm.value.email)) {
    editErrors.value.email = 'Некоректний Email';
    valid = false;
  } else {
    const exists = props.participants.some(
      p => p.id !== selectedParticipant.value?.id &&
           p.email.toLowerCase() === editForm.value.email.trim().toLowerCase()
    );
    if (exists) {
      editErrors.value.email = 'Email вже зайнятий';
      valid = false;
    }
  }

  const phoneRegexp = /^\+380\d{9}$/;
  if (!editForm.value.phone || !phoneRegexp.test(editForm.value.phone)) {
    editErrors.value.phone = 'Формат +380XXXXXXXXX';
    valid = false;
  }

  return valid;
};

const saveEdit = () => {
  if (validateEdit() && selectedParticipant.value) {
    emit('update-participant', { ...selectedParticipant.value, ...editForm.value });
    isEditModalOpen.value = false;
  }
};

const openDeleteModal = (p: Participant) => {
  selectedParticipant.value = p;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (selectedParticipant.value) {
    emit('delete-participant', selectedParticipant.value.id);
    isDeleteModalOpen.value = false;
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded shadow">
    <SearchBar @filter-by-name="searchQuery = $event" />

    <table class="w-full text-left text-sm text-gray-600">
      <thead class="border-b bg-gray-50 text-gray-700 uppercase text-xs">
        <tr>
          <th class="p-3">#</th>
          <th class="p-3 cursor-pointer select-none" @click="handleSort('name')">
            Name {{ sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </th>
          <th class="p-3 cursor-pointer select-none" @click="handleSort('birthDate')">
            Date of Birth {{ sortField === 'birthDate' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
          </th>
          <th class="p-3">Email</th>
          <th class="p-3">Phone number</th>
          <th class="p-3 text-center">Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, index) in filteredAndSortedParticipants" :key="p.id" class="border-b hover:bg-gray-50">
          <td class="p-3 font-semibold">{{ index + 1 }}</td>
          <td class="p-3">{{ p.name }}</td>
          <td class="p-3">{{ p.birthDate }}</td>
          <td class="p-3">{{ p.email }}</td>
          <td class="p-3">{{ p.phone }}</td>
          <td class="p-3 text-center flex gap-2 justify-center">
            <BaseButton variant="secondary" @click="openEditModal(p)">Редагувати</BaseButton>
            <BaseButton variant="danger" @click="openDeleteModal(p)">Видалити</BaseButton>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal v-if="isEditModalOpen" @close="isEditModalOpen = false">
      <template #header>Редагувати дані учасника</template>
      <template #body>
        <BaseInput v-model="editForm.name" label="Name" :error="editErrors.name" />
        <BaseInput v-model="editForm.birthDate" label="Date of Birth" type="date" :error="editErrors.birthDate" />
        <BaseInput v-model="editForm.email" label="Email" :error="editErrors.email" />
        <BaseInput v-model="editForm.phone" label="Phone" :error="editErrors.phone" />
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="isEditModalOpen = false">Скасувати</BaseButton>
        <BaseButton @click="saveEdit">Оновити дані</BaseButton>
      </template>
    </Modal>

    <Modal v-if="isDeleteModalOpen" @close="isDeleteModalOpen = false">
      <template #header>Підтвердження видалення</template>
      <template #body>
        <p>Ви дійсно бажаєте видалити учасника "{{ selectedParticipant?.name }}", "{{ selectedParticipant?.email }}"?</p>
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </Modal>
  </div>
</template>