import * as _ from "lodash";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mesaFiltroIdentificador'
})
export class MesaFiltroIdentificador implements PipeTransform {

  
  transform(array: any[], query: string): any {
    if (query) {
        return _.filter(array, row => (row.identificador).toLowerCase().indexOf(query) > -1);
    }
    return array;
  }

}
