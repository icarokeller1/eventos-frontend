import { Pipe, PipeTransform } from '@angular/core';
import { Evento } from '../models/evento.model';

@Pipe({
  standalone: false,
  name: 'filtroEvento'
})
export class FiltroEventoPipe implements PipeTransform {

  transform(eventos: Evento[], termo: string): Evento[] {
    if (!termo) return eventos;

    termo = termo.toLowerCase();
    return eventos.filter(evento =>
      evento.nome.toLowerCase().includes(termo)
    );
  }
}
