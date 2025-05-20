import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'eventos',
    loadComponent: () => import('./eventos/listar-eventos.component').then(m => m.ListarEventosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'eventos/:id/editar',
    loadComponent: () => import('./eventos/form-evento.component').then(m => m.FormEventoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'eventos/novo',
    loadComponent: () => import('./eventos/form-evento.component').then(m => m.FormEventoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ingressos',
    loadComponent: () => import('./ingressos/listar-ingressos.component').then(m => m.ListarIngressosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ingressos/novo',
    loadComponent: () => import('./ingressos/form-ingresso.component').then(m => m.FormIngressoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ingressos/:id/editar',
    loadComponent: () =>
      import('./ingressos/form-ingresso.component').then(m => m.FormIngressoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'comprar',
    loadComponent: () => import('./compras/comprar-ingresso.component').then(m => m.ComprarIngressoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
