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
}