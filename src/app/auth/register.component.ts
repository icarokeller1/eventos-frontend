// src/app/auth/register.component.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2 class="text-center mb-4">Cadastro</h2>

    <form class="mx-auto" style="max-width: 400px;"
          [formGroup]="form" (ngSubmit)="onSubmit()">

      <!-- Nome -->
      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input type="text" class="form-control" formControlName="nome">
        <small class="text-danger"
               *ngIf="submitted() && form.controls['nome'].invalid">
          Nome é obrigatório
        </small>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" formControlName="email">
        <small class="text-danger"
               *ngIf="submitted() && form.controls['email'].invalid">
          Email válido é obrigatório
        </small>
      </div>

      <!-- Senha -->
      <div class="mb-4">
        <label class="form-label">Senha</label>
        <input type="password" class="form-control" formControlName="senha">
        <small class="text-danger"
               *ngIf="submitted() && form.controls['senha'].invalid">
          Mínimo 6 caracteres
        </small>
      </div>

      <!-- Botão -->
      <button type="submit"
              class="btn btn-primary w-100"
              [disabled]="loading() || form.invalid">
        {{ loading() ? 'Cadastrando…' : 'Cadastrar' }}
      </button>

      <!-- Feedback -->
      <div *ngIf="success()" class="alert alert-success mt-3">
        Usuário criado! Redirecionando para login…
      </div>
      <div *ngIf="errorMsg()" class="alert alert-danger mt-3">
        {{ errorMsg() }}
      </div>

      <p class="text-center mt-4">
        Já tem uma conta?
        <a routerLink="/login" class="text-decoration-underline">Entrar</a>
      </p>
    </form>
  `
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    nome:  ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading   = signal(false);
  success   = signal(false);
  errorMsg  = signal<string | null>(null);
  submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    const { nome, email, senha } = this.form.value as { nome: string; email: string; senha: string };

    this.auth.register( nome, email, senha ).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message || 'Erro ao registrar usuário';
        this.errorMsg.set(msg);
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
}
