import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngressoService } from '../shared/services/ingresso.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-ingressos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-center mb-4">Ingressos</h2>

    <div class="card shadow-sm mx-auto" style="max-width: 700px;">
      <ul class="list-group list-group-flush">

        <!-- item -->
        <li *ngFor="let i of ingressos(); trackBy: trackById"
            class="list-group-item">

          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">

            <!-- bloco esquerdo -->
            <div class="flex-grow-1 text-center text-md-start">
              <div class="fw-bold fs-6">{{ i.tipo }}</div>
              <small class="text-muted">
                Evento: {{ i.evento?.nome || 'Desconhecido' }}
              </small>
            </div>

            <!-- quantidade + preço -->
            <div class="text-center text-md-end">
              <span class="badge me-2"
                    [class.bg-success]="i.quantidade > 0"
                    [class.bg-secondary]="i.quantidade === 0">
                {{ i.quantidade }} disp.
              </span>
              <span class="fw-semibold text-primary">
                {{ i.preco | currency:'BRL':'symbol':'1.2-2' }}
              </span>
            </div>

            <!-- botões -->
            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-sm btn-success"  (click)="comprar(i)">Comprar</button>
              <button class="btn btn-sm btn-primary"  (click)="editar(i)">Editar</button>
              <button class="btn btn-sm btn-danger"   (click)="deletar(i)">Excluir</button>
            </div>
          </div>
        </li>

        <!-- vazio -->
        <li class="list-group-item text-center text-muted"
            *ngIf="ingressos().length === 0">
          Nenhum ingresso cadastrado.
        </li>
      </ul>
    </div>
  `
})
export class ListarIngressosComponent {
  private service = inject(IngressoService);
  private router = inject(Router);
  ingressos = signal<any[]>([]);

  comprar(i: any) {
    this.router.navigate(['/comprar'], { queryParams: { ingressoId: i.id } });
  }
  editar(i: any)  { this.router.navigate(['/ingressos', i.id, 'editar']); }
  deletar(i: any) {
    if (!confirm('Excluir este ingresso?')) return;
    this.service.deletar(i.id).subscribe(() =>
      this.service.listar().subscribe(d => this.ingressos.set(d))
    );
  }

  constructor() {
    effect(() => {
      this.service.listar().subscribe(data => this.ingressos.set(data));
    });
  }

  trackById(_: number, ing: any) { return ing.id; }
}
