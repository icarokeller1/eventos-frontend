import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Barra superior -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container-fluid">
        <span class="navbar-brand">Eventos Frontend</span>

        <!-- Navegação aparece só quando o usuário está logado -->
        <div *ngIf="auth.isAuthenticated()" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" routerLink="/eventos">Eventos</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/eventos/novo">Novo Evento</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/ingressos">Ingressos</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/ingressos/novo">Novo Ingresso</a></li>
            <li class="nav-item"><a class="nav-link" routerLink="/comprar">Comprar</a></li>
          </ul>

          <!-- Botão de logout agora visível -->
          <button class="btn btn-outline-light btn-sm" (click)="logout()">Sair</button>
        </div>
      </div>
    </nav>

    <!-- Área principal -->
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  auth = inject(AuthService);

  logout(): void {
    this.auth.logout();
  }
}
