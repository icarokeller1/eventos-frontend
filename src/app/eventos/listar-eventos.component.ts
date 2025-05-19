import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../shared/services/evento.service';
import { FiltroEventoPipe } from '../shared/pipes/filtro-evento.pipe';

@Component({
  selector: 'app-listar-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltroEventoPipe],
  template: `
    <h2 class="mb-3">Eventos</h2>

    <input  type="text"
            class="form-control mb-3"
            [ngModel]="filtro()"
            (ngModelChange)="filtro.set($event)"
            placeholder="Buscar por nome" />

    <ul class="list-group">
      <li *ngFor="let evento of eventosFiltrados(); trackBy: trackById"
          class="list-group-item d-flex justify-content-between align-items-start">

        <!-- Info -->
        <div>
          <div class="fw-bold">{{ evento.nome }}</div>
          {{ evento.local }} – {{ evento.data | date:'shortDate' }}
        </div>

        <!-- Ações -->
        <div>
          <button class="btn btn-sm btn-primary me-1" (click)="editar(evento)">Editar</button>
          <button class="btn btn-sm btn-danger"  (click)="deletar(evento)">Excluir</button>
        </div>
      </li>
    </ul>
  `
})
export class ListarEventosComponent {
  private service = inject(EventoService);

  filtro   = signal('');
  eventos  = signal<any[]>([]);

  eventosFiltrados = computed(() =>
    this.filtro().length
      ? new FiltroEventoPipe().transform(this.eventos(), this.filtro())
      : this.eventos()
  );

  constructor() {
    effect(() => {
      this.service.listar().subscribe(dados => this.eventos.set(dados));
    });
  }

  /* ---------- ações ---------- */
  editar(evento: any)  { /* navegue p/ form de edição ou abra modal */ }
  deletar(evento: any) { /* confirme e chame service.delete(evento.id) */ }

  /* ---------- performance ---------- */
  trackById(_: number, ev: any) { return ev.id; }
}
