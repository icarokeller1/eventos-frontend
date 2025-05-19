// src/app/auth/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2 class="text-center mb-4">Login</h2>

    <form class="mx-auto" style="max-width: 400px;"
          [formGroup]="form" (ngSubmit)="onSubmit()">

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
          Senha mínima de 6 caracteres
        </small>
      </div>

      <!-- Botão -->
      <button type="submit"
              class="btn btn-primary w-100"
              [disabled]="loading() || form.invalid">
        {{ loading() ? 'Entrando…' : 'Entrar' }}
      </button>

      <!-- Alertas -->
      <div *ngIf="errorMsg()" class="alert alert-danger mt-3">
        {{ errorMsg() }}
      </div>

      <p class="text-center mt-4">
        Não tem conta?
        <a routerLink="/register" class="text-decoration-underline">Cadastre-se</a>
      </p>
    </form>
  `
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading   = signal(false);
  errorMsg  = signal<string | null>(null);
  submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMsg.set(null);

    const { email, senha } = this.form.value as { email: string; senha: string };

    this.auth.login( email, senha ).subscribe({
      next: () => this.router.navigateByUrl('/eventos'),
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message || 'Credenciais inválidas';
        this.errorMsg.set(msg);
      },
      complete: () => this.loading.set(false)
    });
  }
}
