import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private readonly apiUrl = 'https://eventos-api-fullstack-3tcq.onrender.com/api/purchase';

  constructor(private http: HttpClient, private auth: AuthService) {}

  comprar(data: { ingressoId: number; quantidade: number }) {
    const email = localStorage.getItem('user');          // pega do localStorage
    return this.http.post(this.apiUrl, { ...data, email });
  }

  listar() { return this.http.get<any[]>(this.apiUrl); }
}
