import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IngressosService } from '../../services/ingressos.service';
import { Ingresso } from '../../models/ingresso.model';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../models/evento.model';

@Component({
  standalone: false,
  selector: 'app-ingressos',
  templateUrl: './ingressos.component.html',
  styleUrls: ['./ingressos.component.css']
})
export class IngressosComponent implements OnInit {
  ingressos: Ingresso[] = [];
  eventos: Evento[] = [];
  ingressoForm!: FormGroup;
  editandoId: number | null = null;

  constructor(
    private ingressoService: IngressosService,
    private eventoService: EventosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.carregarIngressos();
    this.carregarEventos();
    this.ingressoForm = this.fb.group({
      tipo: [''],
      preco: [0],
      quantidade: [0],
      eventoId: [null]
    });
  }

  carregarIngressos() {
    this.ingressoService.listar().subscribe(res => this.ingressos = res);
  }

  carregarEventos() {
    this.eventoService.listar().subscribe(res => this.eventos = res);
  }

  salvarIngresso() {
    const ingresso = this.ingressoForm.value;

    if (this.editandoId) {
      this.ingressoService.atualizar(this.editandoId, ingresso).subscribe(() => {
        this.editandoId = null;
        this.ingressoForm.reset();
        this.carregarIngressos();
      });
    } else {
      this.ingressoService.criar(ingresso).subscribe(() => {
        this.ingressoForm.reset();
        this.carregarIngressos();
      });
    }
  }

  editarIngresso(ingresso: Ingresso) {
    this.ingressoForm.patchValue(ingresso);
    this.editandoId = ingresso.id!;
  }

  excluirIngresso(id: number) {
    if (confirm('Tem certeza que deseja excluir?')) {
      this.ingressoService.deletar(id).subscribe(() => {
        this.carregarIngressos();
      });
    }
  }
}
