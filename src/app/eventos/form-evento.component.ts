// src/app/eventos/form-evento.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from '../shared/services/evento.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="mb-4 text-center">Criar Evento</h2>

    <form class="mx-auto" style="max-width: 500px;"
          [formGroup]="form" (ngSubmit)="onSubmit()" enctype="multipart/form-data">

      <!-- Nome -->
      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input type="text" class="form-control" formControlName="nome">
        <small class="text-danger" *ngIf="submitted() && form.controls.nome.invalid">
          Nome é obrigatório
        </small>
      </div>

      <!-- Data -->
      <div class="mb-3">
        <label class="form-label">Data</label>
        <input type="date" class="form-control" formControlName="data">
        <small class="text-danger" *ngIf="submitted() && form.controls.data.invalid">
          Data é obrigatória
        </small>
      </div>

      <!-- Local -->
      <div class="mb-3">
        <label class="form-label">Local</label>
        <input type="text" class="form-control" formControlName="local">
        <small class="text-danger" *ngIf="submitted() && form.controls.local.invalid">
          Local é obrigatório
        </small>
      </div>

      <!-- Descrição -->
      <div class="mb-3">
        <label class="form-label">Descrição</label>
        <textarea rows="3" class="form-control" formControlName="descricao"></textarea>
      </div>

      <!-- Imagem -->
      <div class="mb-4">
        <label class="form-label">Imagem</label>
        <input type="file" class="form-control" (change)="onFileChange($event)">
        <small class="text-danger" *ngIf="submitted() && !selectedFile">
          Selecione uma imagem
        </small>
      </div>

      <button type="submit"
              class="btn btn-primary w-100"
              [disabled]="loading() || form.invalid">
        {{ loading() ? 'Salvando…' : 'Salvar' }}
      </button>

      <!-- Alertas -->
      <div *ngIf="success()" class="alert alert-success mt-3">
        Evento criado com sucesso! Redirecionando…
      </div>
      <div *ngIf="errorMsg()" class="alert alert-danger mt-3">
        {{ errorMsg() }}
      </div>
    </form>
  `
})
export class FormEventoComponent {
  private fb      = inject(FormBuilder);
  private service = inject(EventoService);
  private router  = inject(Router);

  selectedFile: File | null = null;

  form = this.fb.group({
    nome:  ['', Validators.required],
    data:  ['', Validators.required],
    local: ['', Validators.required],
    descricao: ['']
  });

  loading   = signal(false);
  success   = signal(false);
  errorMsg  = signal<string | null>(null);
  submitted = signal(false);

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedFile = file;
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid || !this.selectedFile) return;

    /* monta payload */
    const fd = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => v && fd.append(k, v));
    fd.append('imagem', this.selectedFile);

    /* feedback UX */
    this.loading.set(true);
    this.errorMsg.set(null);

    /* chamada */
    this.service.criar(fd).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.router.navigateByUrl('/eventos'), 1000);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message || `Erro ${err.status}: ${err.statusText}`;
        this.errorMsg.set(msg);
      },
      complete: () => this.loading.set(false)
    });
  }
}
