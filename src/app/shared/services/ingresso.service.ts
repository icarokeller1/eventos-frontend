import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class IngressoService {
  private readonly apiUrl = 'https://eventos-api-fullstack-3tcq.onrender.com/api/tickets';

  listar() { return this.http.get<any[]>(this.apiUrl); }
  get(id: number) { return this.http.get<any>(`${this.apiUrl}/${id}`); }
  criar(data: any) { return this.http.post(this.apiUrl, data); }
  atualizar(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data); }
  deletar(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
  constructor(private http: HttpClient) {}
}
