import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filtroEvento', standalone: true })
export class FiltroEventoPipe implements PipeTransform {
  transform(eventos: any[], termo: string): any[] {
    if (!termo) return eventos;
    const termoLower = termo.toLowerCase();
    return eventos.filter(e => e.nome.toLowerCase().includes(termoLower));
  }
}
