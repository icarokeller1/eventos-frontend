import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private readonly apiUrl = 'https://eventos-api-fullstack-3tcq.onrender.com/api/purchase';

  constructor(private http: HttpClient) {}

  comprar(data: { ingressoId: number; quantidade: number }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
