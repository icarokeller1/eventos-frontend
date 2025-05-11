import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { IngressosComponent } from './pages/ingressos/ingressos.component';

const routes: Routes = [
  { path: '', component: EventosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'ingressos', component: IngressosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
