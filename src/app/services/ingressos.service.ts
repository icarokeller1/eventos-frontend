import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingresso } from '../models/ingresso.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngressosService {
  private api = 'https://eventos-api-fullstack.onrender.com/api/tickets';

  constructor(private http: HttpClient) {}

  listar(): Observable<Ingresso[]> {
    return this.http.get<Ingresso[]>(this.api);
  }

  buscarPorId(id: number): Observable<Ingresso> {
    return this.http.get<Ingresso>(`${this.api}/${id}`);
  }

  criar(ingresso: Ingresso): Observable<Ingresso> {
    return this.http.post<Ingresso>(this.api, ingresso);
  }

  atualizar(id: number, ingresso: Ingresso): Observable<Ingresso> {
    return this.http.put<Ingresso>(`${this.api}/${id}`, ingresso);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
