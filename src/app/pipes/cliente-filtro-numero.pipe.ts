import * as _ from "lodash";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clienteFiltroNumero'
})
export class ClienteFiltroNumero implements PipeTransform {

  
  transform(array: any[], query: string): any {
    if (query) {
        return _.filter(array, row => (row.telefonoC).toLowerCase().indexOf(query) > -1);
    }
    return array;
  }

}
