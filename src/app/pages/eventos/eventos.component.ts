import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../models/evento.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = [];
  eventoForm!: FormGroup;
  imagemSelecionada: File | null = null;
  editandoId: number | null = null;

  filtro: string = ''; 

  constructor(private eventoService: EventosService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.carregarEventos();
    this.eventoForm = this.fb.group({
      nome: [''],
      data: [''],
      local: [''],
      descricao: [''],
    });
  }

  carregarEventos() {
    this.eventoService.listar().subscribe(res => this.eventos = res);
  }

  selecionarImagem(event: any) {
    this.imagemSelecionada = event.target.files[0];
  }

  salvarEvento() {
    const formData = new FormData();
    Object.entries(this.eventoForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (this.imagemSelecionada) {
      formData.append('imagem', this.imagemSelecionada);
    }

    if (this.editandoId) {
      this.eventoService.atualizar(this.editandoId, formData).subscribe(() => {
        this.editandoId = null;
        this.eventoForm.reset();
        this.carregarEventos();
      });
    } else {
      this.eventoService.criar(formData).subscribe(() => {
        this.eventoForm.reset();
        this.carregarEventos();
      });
    }
  }

  editarEvento(evento: Evento) {
    this.eventoForm.patchValue(evento);
    this.editandoId = evento.id!;
  }

  excluirEvento(id: number) {
    if (confirm('Tem certeza que deseja excluir?')) {
      this.eventoService.deletar(id).subscribe(() => {
        this.carregarEventos();
      });
    }
  }
}
