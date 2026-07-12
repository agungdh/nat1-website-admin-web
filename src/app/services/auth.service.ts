import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserDto {
  uuid: string;
  username: string;
  name: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, data);
  }

  getCurrentUser() {
    return this.http.get<UserDto>(`${this.apiUrl}/admin/users/me`);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
