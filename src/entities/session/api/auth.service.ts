import { http } from '@/shared/api';
import type { AuthResponse, AuthUser } from '../model/types'; 

export class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });
  }

  async getCurrentUser(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me');
  }
}