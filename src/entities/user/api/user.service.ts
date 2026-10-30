import { http } from '@/shared/api';
import type { User, CreateUserDto, UpdateUserDto } from '../model/types';
import type { Readable, Creatable, Editable, Deletable } from '@/shared/api';

interface UsersApiResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export class UserService implements Readable<User>, Creatable<User, CreateUserDto>, Editable<User, UpdateUserDto>, Deletable {
  async getAll(params: { limit?: number; skip?: number; q?: string } = {}): Promise<{ users: User[]; total: number }> {
    const limit = params.limit ?? 10;
    const skip = params.skip ?? 0;
    
    if (params.q) {
      const data = await http<UsersApiResponse>(`/users/search?q=${encodeURIComponent(params.q)}&limit=${limit}&skip=${skip}`);
      return { users: data.users, total: data.total };
    }

    const data = await http<UsersApiResponse>(`/users?limit=${limit}&skip=${skip}`);
    return { users: data.users, total: data.total };
  }

  async getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`);
  }

  async create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' });
  }
}