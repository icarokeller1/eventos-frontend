import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evento } from '../models/evento.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private api = 'https://eventos-api-fullstack.onrender.com/api/events';

  constructor(private http: HttpClient) {}

  listar(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.api);
  }

  buscarPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.api}/${id}`);
  }

  criar(evento: FormData): Observable<Evento> {
    return this.http.post<Evento>(this.api, evento);
  }

  atualizar(id: number, evento: FormData): Observable<Evento> {
    return this.http.put<Evento>(`${this.api}/${id}`, evento);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
