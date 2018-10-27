import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'clientes-home',
  templateUrl: './clientes-home.component.html'
})
export class ClientesHomeComponent implements OnInit {
    public titulo: string;
    
        constructor(){
            this.titulo = 'CLIENTES';
        }
  ngOnInit() {

  }

}
