import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { IngressosComponent } from './pages/ingressos/ingressos.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: EventosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'eventos', component: EventosComponent, canActivate: [AuthGuard] },
  { path: 'ingressos', component: IngressosComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
