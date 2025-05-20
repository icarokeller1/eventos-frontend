import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private readonly apiUrl = 'https://eventos-api-fullstack-3tcq.onrender.com/api/events';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criar(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
  
  get(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deletar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}