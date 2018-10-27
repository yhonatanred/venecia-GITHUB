import * as _ from "lodash";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usuarioFiltroNombre'
})
export class UsuarioFiltroNombre implements PipeTransform {

  
  transform(array: any[], query: string): any {
    if (query) {
      return _.filter(array, row => (row.nombre).toLowerCase().indexOf(query) > -1);
    }
    return array;
  }

}
