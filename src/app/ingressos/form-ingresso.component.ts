import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IngressoService } from '../shared/services/ingresso.service';
import { EventoService } from '../shared/services/evento.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-ingresso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <h2 class="text-center mb-4">Cadastrar Ingresso</h2>

    <form class="mx-auto" style="max-width: 500px;"
          [formGroup]="form" (ngSubmit)="onSubmit()">

      <!-- Tipo -->
      <div class="mb-3">
        <label class="form-label">Tipo</label>
        <input type="text" class="form-control" formControlName="tipo">
        <small class="text-danger" *ngIf="submitted() && form.controls['tipo'].invalid">
          Tipo é obrigatório
        </small>
      </div>

      <!-- Preço -->
      <div class="mb-3">
        <label class="form-label">Preço (R$)</label>
        <input type="number" class="form-control" formControlName="preco" step="0.01" min="0">
        <small class="text-danger" *ngIf="submitted() && form.controls['preco'].invalid">
          Preço mínimo 0,01
        </small>
      </div>

      <!-- Quantidade -->
      <div class="mb-3">
        <label class="form-label">Quantidade</label>
        <input type="number" class="form-control" formControlName="quantidade" min="1">
        <small class="text-danger" *ngIf="submitted() && form.controls['quantidade'].invalid">
          Quantidade mínima 1
        </small>
      </div>

      <!-- Evento -->
      <div class="mb-4">
        <label class="form-label">Evento</label>
        <select class="form-select" formControlName="eventoId">
          <option [ngValue]="null" disabled selected>Selecione…</option>
          <option *ngFor="let e of eventos" [ngValue]="e.id">{{ e.nome }}</option>
        </select>
        <small class="text-danger" *ngIf="submitted() && form.controls['eventoId'].invalid">
          Selecione um evento
        </small>
      </div>

      <!-- Botão -->
      <button type="submit"
              class="btn btn-primary w-100"
              [disabled]="loading() || form.invalid">
        {{ loading() ? 'Salvando…' : 'Salvar' }}
      </button>

      <!-- Feedback -->
      <div *ngIf="success()" class="alert alert-success mt-3">
        Ingresso criado! Redirecionando…
      </div>
      <div *ngIf="errorMsg()" class="alert alert-danger mt-3">
        {{ errorMsg() }}
      </div>
    </form>
  `
})
export class FormIngressoComponent implements OnInit {
  id = 0;
  editMode = signal(false);
  form!: FormGroup;
  eventos: any[] = [];
  private route          = inject(ActivatedRoute);
  private fb             = inject(FormBuilder);
  private ingressoSrv    = inject(IngressoService);
  private eventoSrv      = inject(EventoService);
  private router         = inject(Router);

  /* sinais de UX */
  loading   = signal(false);
  success   = signal(false);
  errorMsg  = signal<string | null>(null);
  submitted = signal(false);

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    this.form = this.fb.group({
      tipo:       ['', Validators.required],
      preco:      [0, [Validators.required, Validators.min(0.01)]],
      quantidade: [0, [Validators.required, Validators.min(1)]],
      eventoId:   [null, Validators.required],
    });

    this.eventoSrv.listar().subscribe(e => (this.eventos = e));
    if (this.id) {
      this.editMode.set(true);
      this.ingressoSrv.get(this.id).subscribe(i => this.form.patchValue(i));
    }
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    const req$ = this.editMode()
      ? this.ingressoSrv.atualizar(this.id, this.form.value)
      : this.ingressoSrv.criar(this.form.value);

    req$.subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.router.navigateByUrl('/ingressos'), 800);
      },
      error: (e: HttpErrorResponse) =>
        this.errorMsg.set(e.error?.message || `Erro ${e.status}`),
      complete: () => this.loading.set(false)
    });
  }
}
