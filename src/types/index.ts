export interface Participant {
  id: string;
  name: string;
  birthDate: string; // Формат YYYY-MM-DD
  email: string;
  phone: string; // Формат +380XXXXXXXXX
}

export type SortField = 'name' | 'birthDate';
export type SortOrder = 'asc' | 'desc';