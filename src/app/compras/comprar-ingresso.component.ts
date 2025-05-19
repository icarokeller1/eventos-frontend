// src/app/compras/comprar-ingresso.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

      <!-- Ingresso -->
      <div class="mb-3">
        <label class="form-label">Ingresso</label>
        <select class="form-select" formControlName="ingressoId">
          <option [ngValue]="null" disabled selected>Selecione…</option>
          <option *ngFor="let i of ingressos" [ngValue]="i.id">
            {{ i.tipo }} – {{ i.evento?.nome || 'Evento?' }}
          </option>
        </select>
        <small class="text-danger"
               *ngIf="submitted() && form.controls['ingressoId'].invalid">
          Selecione um ingresso
        </small>
      </div>

      <!-- Quantidade -->
      <div class="mb-4">
        <label class="form-label">Quantidade</label>
        <input type="number" class="form-control" formControlName="quantidade" min="1">
        <small class="text-danger"
               *ngIf="submitted() && form.controls['quantidade'].invalid">
          Quantidade mínima 1
        </small>
      </div>

      <!-- Botão -->
      <button type="submit"
              class="btn btn-primary w-100"
              [disabled]="loading() || form.invalid">
        {{ loading() ? 'Processando…' : 'Comprar' }}
      </button>

      <!-- Feedback -->
      <div *ngIf="success()" class="alert alert-success mt-3">
        Compra realizada com sucesso! Redirecionando…
      </div>
      <div *ngIf="errorMsg()" class="alert alert-danger mt-3">
        {{ errorMsg() }}
      </div>
    </form>
  `
})
export class ComprarIngressoComponent implements OnInit {
  form!: FormGroup;
  ingressos: any[] = [];

  private fb          = inject(FormBuilder);
  private ingressoSrv = inject(IngressoService);
  private compraSrv   = inject(CompraService);
  private router      = inject(Router);

  /* sinais UX */
  loading   = signal(false);
  success   = signal(false);
  errorMsg  = signal<string | null>(null);
  submitted = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      ingressoId: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
    });

    this.ingressoSrv.listar().subscribe({
      next: data => (this.ingressos = data)
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
        setTimeout(() => this.router.navigateByUrl('/'), 1000);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message || `Erro ${err.status}: ${err.statusText}`;
        this.errorMsg.set(msg);
      },
      complete: () => this.loading.set(false)
    });
  }
}
