import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngressoService } from '../shared/services/ingresso.service';

@Component({
  selector: 'app-listar-ingressos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="mb-3">Ingressos</h2>

    <div class="card">
      <ul class="list-group list-group-flush">
        <li *ngFor="let i of ingressos(); trackBy: trackById"
            class="list-group-item d-flex justify-content-between align-items-start">

          <!-- Informações -->
          <div>
            <div class="fw-bold">{{ i.tipo }}</div>
            <small class="text-muted">
              Evento: {{ i.evento?.nome || 'Desconhecido' }}
            </small>
          </div>

          <!-- Preço -->
          <span class="badge bg-primary align-self-center">
            {{ i.preco | currency:'BRL':'symbol':'1.2-2' }}
          </span>
        </li>

        <li class="list-group-item text-center text-muted" *ngIf="ingressos().length === 0">
          Nenhum ingresso cadastrado.
        </li>
      </ul>
    </div>
  `
})
export class ListarIngressosComponent {
  private service = inject(IngressoService);
  ingressos = signal<any[]>([]);

  constructor() {
    effect(() => {
      this.service.listar().subscribe(data => this.ingressos.set(data));
    });
  }

  trackById(_: number, ing: any) { return ing.id; }
}
