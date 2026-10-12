import { http } from '../api/http-client';
import type { AuthResponse, User } from '../types';

export class AuthService {
  async login(username: string, password: string):Promise<AuthResponse> {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return http<User>('/auth/me');
  }
}