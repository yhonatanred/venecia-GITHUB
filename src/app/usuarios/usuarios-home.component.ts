import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'usuarios-home',
  templateUrl: './usuarios-home.component.html'
})
export class UsuariosHomeComponent implements OnInit {
    public titulo: string;
    
        constructor(){
            this.titulo = 'usuarios';
        }
  ngOnInit() {

  }

}
