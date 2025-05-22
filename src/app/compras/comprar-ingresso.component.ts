import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';          // ⬅️ 1
import { IngressoService } from '../shared/services/ingresso.service';
import { CompraService } from '../shared/services/compra.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-comprar-ingresso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <h2 class="text-center mb-4">Comprar Ingresso</h2>

    <form class="mx-auto" style="max-width: 500px;"
          [formGroup]="form" (ngSubmit)="onSubmit()">

      <div class="mb-3">
        <label class="form-label">Ingresso</label>
        <select class="form-select"
                formControlName="ingressoId"
                [disabled]="preSelecionado">
          <option [ngValue]="null" disabled>Selecione…</option>
          <option *ngFor="let i of ingressos" [ngValue]="i.id">
            {{ i.tipo }} – {{ i.evento?.nome || 'Evento?' }}
          </option>
        </select>
        <small class="text-danger"
               *ngIf="submitted() && form.controls['ingressoId'].invalid">
          Selecione um ingresso
        </small>
      </div>

      <div class="mb-4">
        <label class="form-label">Quantidade</label>
        <input type="number" class="form-control"
               formControlName="quantidade" min="1">
        <small class="text-danger"
               *ngIf="submitted() && form.controls['quantidade'].invalid">
          Quantidade mínima 1
        </small>
      </div>

      <button type="submit"
              class="btn btn-primary w-100"
              [disabled]="loading() || form.invalid">
        {{ loading() ? 'Processando…' : 'Comprar' }}
      </button>

      <div *ngIf="success()"  class="alert alert-success mt-3">Compra realizada!</div>
      <div *ngIf="errorMsg()" class="alert alert-danger  mt-3">{{ errorMsg() }}</div>
    </form>
  `
})
export class ComprarIngressoComponent implements OnInit {
  form!: FormGroup;
  ingressos: any[] = [];
  preSelecionado = false;

  private fb = inject(FormBuilder);
  private ingressoSrv = inject(IngressoService);
  private compraSrv = inject(CompraService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(false);
  success = signal(false);
  errorMsg = signal<string | null>(null);
  submitted = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      ingressoId: [null, Validators.required],
      quantidade: [1,   [Validators.required, Validators.min(1)]],
    });

    const idFromQuery = Number(this.route.snapshot.queryParamMap.get('ingressoId'));
    if (idFromQuery) {
      this.preSelecionado = true;
      this.form.patchValue({ ingressoId: idFromQuery });
    }

    this.ingressoSrv.listar().subscribe({
      next: data => (this.ingressos = data),
      complete: () => {
        /* se id veio na URL mas não existe na lista, limpa seleção */
        if (this.preSelecionado &&
            !this.ingressos.some(i => i.id === idFromQuery)) {
          this.preSelecionado = false;
          this.form.patchValue({ ingressoId: null });
        }
      }
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    this.compraSrv.comprar(this.form.value).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.router.navigateByUrl('/compras'), 800);
      },
      error: (e: HttpErrorResponse) => {
      if (e.status === 400) {
        this.errorMsg.set(e.error?.error ?? 'Erro de validação.');
      } else {
        this.errorMsg.set(e.error?.message || `Erro ${e.status}: ${e.statusText}`);
      }
      this.loading.set(false);
    },
      complete: () => this.loading.set(false)
    });
  }
}
