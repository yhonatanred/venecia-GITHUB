import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mesas-home',
  templateUrl: './mesas-home.component.html'
})
export class MesasHomeComponent implements OnInit {
    public titulo: string;
    
        constructor(){
            this.titulo = 'MESAS';
        }
  ngOnInit() {

  }

}
