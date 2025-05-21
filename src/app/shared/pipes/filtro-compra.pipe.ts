import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filtroCompra', standalone: true })
export class FiltroCompraPipe implements PipeTransform {
  transform(list: any[], eventoTermo = '', userTermo = '') {
    if (!eventoTermo && !userTermo) return list;

    const ev = eventoTermo.toLowerCase();
    const usr = userTermo.toLowerCase();

    return list.filter(c =>
      (!ev  || c.ingresso?.evento?.nome?.toLowerCase().includes(ev)) &&
      (!usr || c.usuario?.nome?.toLowerCase().includes(usr) ||
               c.usuario?.email?.toLowerCase().includes(usr))
    );
  }
}
