import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../shared/services/evento.service';
import { FiltroEventoPipe } from '../shared/pipes/filtro-evento.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          {{ evento.local }} – {{ evento.data | date:'shortDate':'UTC' }}
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
  private router = inject(Router);

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
  editar(ev: any) {
    this.router.navigate(['/eventos', ev.id, 'editar']);
  }
  deletar(ev: any) {
    if (!confirm('Deseja excluir este evento?')) return;
    this.service.deletar(ev.id).subscribe({
      next: () => this.service.listar().subscribe(d => this.eventos.set(d)),
      error: () => alert('Erro ao excluir')
    });
  }

  /* ---------- performance ---------- */
  trackById(_: number, ev: any) { return ev.id; }
}
