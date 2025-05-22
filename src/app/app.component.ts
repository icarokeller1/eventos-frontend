import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">

        <a class="navbar-brand" routerLink="/">Eventos Frontend</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navMain" aria-controls="navMain"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navMain" class="collapse navbar-collapse" *ngIf="auth.isAuthenticated()">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a routerLink="/eventos" routerLinkActive="active" class="nav-link">Eventos</a>
            </li>
            <li class="nav-item">
              <a routerLink="/eventos/novo" routerLinkActive="active" class="nav-link">Novo Evento</a>
            </li>
            <li class="nav-item">
              <a routerLink="/ingressos" routerLinkActive="active" class="nav-link">Ingressos</a>
            </li>
            <li class="nav-item">
              <a routerLink="/ingressos/novo" routerLinkActive="active" class="nav-link">Novo Ingresso</a>
            </li>
            <li class="nav-item">
              <a routerLink="/compras" routerLinkActive="active" class="nav-link">Compras</a>
            </li>
            <li class="nav-item">
              <a routerLink="/comprar" routerLinkActive="active" class="nav-link">Nova Compra</a>
            </li>
          </ul>

          <button class="btn btn-outline-light btn-sm" (click)="logout()">Sair</button>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  auth = inject(AuthService);
  logout() { this.auth.logout(); }
}
