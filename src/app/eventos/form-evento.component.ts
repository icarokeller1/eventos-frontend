import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from '../shared/services/evento.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="mb-4 text-center">Criar Evento</h2>

    <form class="mx-auto" style="max-width: 500px;"
          [formGroup]="form" (ngSubmit)="onSubmit()" enctype="multipart/form-data">

      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input type="text" class="form-control" formControlName="nome">
        <small class="text-danger" *ngIf="submitted() && form.controls.nome.invalid">
          Nome é obrigatório
        </small>
      </div>

      <div class="mb-3">
        <label class="form-label">Data</label>
        <input type="date" class="form-control" formControlName="data">
        <small class="text-danger" *ngIf="submitted() && form.controls.data.invalid">
          Data é obrigatória
        </small>
      </div>

      <div class="mb-3">
        <label class="form-label">Local</label>
        <input type="text" class="form-control" formControlName="local">
        <small class="text-danger" *ngIf="submitted() && form.controls.local.invalid">
          Local é obrigatório
        </small>
      </div>

      <div class="mb-3">
        <label class="form-label">Descrição</label>
        <textarea rows="3" class="form-control" formControlName="descricao"></textarea>
      </div>

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
  private fb = inject(FormBuilder);
  private service = inject(EventoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = 0;
  editMode = signal(false);

  selectedFile: File | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    data: ['', Validators.required],
    local: ['', Validators.required],
    descricao: ['']
  });

  loading = signal(false);
  success = signal(false);
  errorMsg = signal<string | null>(null);
  submitted = signal(false);

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id') || 0);
    if (this.id) {
      this.editMode.set(true);
      this.service.get(this.id).subscribe(ev => {
        const onlyDate = new Date(ev.data).toISOString().slice(0, 10);
        this.form.patchValue({
          ...ev,
          data: onlyDate
        });
      });
    }
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedFile = file;
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid || !this.selectedFile) return;

    const fd = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => v && fd.append(k, v));
    fd.append('imagem', this.selectedFile);

    this.loading.set(true);
    this.errorMsg.set(null);

    this.loading.set(true);
    const req$ = this.editMode() ? this.service.atualizar(this.id, fd)
                                : this.service.criar(fd);

    req$.subscribe({
      next: () => { this.success.set(true); setTimeout(() => this.router.navigateByUrl('/eventos'), 800); },
      error: err => this.errorMsg.set(err.error?.message || 'Erro'),
      complete: () => this.loading.set(false)
    });
  }
}
