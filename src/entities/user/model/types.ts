export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password?: string;
  age: number;
  gender: string;
  phone: string;
}

export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export type SortField = 'firstName' | 'email' | 'age';
export type SortOrder = 'asc' | 'desc';

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
}