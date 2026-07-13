import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

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

  readonly isAuthenticated = signal<boolean | null>(null);

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(() => this.isAuthenticated.set(true))
    );
  }

  getCurrentUser() {
    return this.http.get<UserDto>(`${this.apiUrl}/admin/users/me`);
  }

  checkAuth() {
    return this.http.get<UserDto>(`${this.apiUrl}/admin/users/me`).pipe(
      tap({
        next: () => this.isAuthenticated.set(true),
        error: () => this.isAuthenticated.set(false),
      })
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      error: () => {},
    });
    this.isAuthenticated.set(false);
  }
}
