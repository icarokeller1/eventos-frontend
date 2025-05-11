import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EventosComponent } from './pages/eventos/eventos.component';
import { IngressosComponent } from './pages/ingressos/ingressos.component';
import { LoginComponent } from './pages/login/login.component';
import { FiltroEventoPipe } from './pipes/filtro-evento.pipe';


@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    IngressosComponent,
    LoginComponent,
    FiltroEventoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
