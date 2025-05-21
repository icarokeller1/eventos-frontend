import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../shared/services/compra.service';
import { FiltroCompraPipe } from '../shared/pipes/filtro-compra.pipe';

@Component({
  selector: 'app-listar-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 class="text-center mb-4">Compras realizadas</h2>

    <!-- filtros -->
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <input class="form-control" placeholder="Filtrar por evento"
               [ngModel]="eventoFiltro()" (ngModelChange)="eventoFiltro.set($event)">
      </div>
      <div class="col-md-6">
        <input class="form-control" placeholder="Filtrar por usuário (nome ou email)"
               [ngModel]="userFiltro()" (ngModelChange)="userFiltro.set($event)">
      </div>
    </div>

    <!-- tabela -->
    <div class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>Evento</th>
            <th>Ingresso</th>
            <th>Usuário</th>
            <th>Qtd.</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of comprasFiltradas(); trackBy: trackById">
            <td>{{ c.ingresso?.evento?.nome }}</td>
            <td>{{ c.ingresso?.tipo || '—' }}</td>
            <td>{{ c.usuario?.nome  || '—' }}</td>
            <td>{{ c.quantidade }}</td>
            <td>{{ c.createdAt | date:'short' }}</td>
          </tr>
          <tr *ngIf="comprasFiltradas().length === 0">
            <td colspan="5" class="text-center text-muted">Nenhuma compra encontrada.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ListarComprasComponent {
  private srv = inject(CompraService);

  compras = signal<any[]>([]);
  eventoFiltro = signal('');
  userFiltro = signal('');

  comprasFiltradas = computed(() =>
    new FiltroCompraPipe().transform(
      this.compras(),
      this.eventoFiltro(),
      this.userFiltro()
    )
  );

  constructor() {
    effect(() => this.srv.listar().subscribe(d => this.compras.set(d)));
  }

  trackById(_: number, c: any) { return c.id; }
}
