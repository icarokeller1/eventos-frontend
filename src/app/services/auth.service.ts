import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'https://eventos-api-fullstack.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string) {
    return this.http.post<{ token: string }>(`${this.api}/login`, { email, senha })
      .pipe(tap(res => {
        localStorage.setItem('token', res.token);
      }));
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
