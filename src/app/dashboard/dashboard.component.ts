import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../clientes/clientes.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ProductosService } from '../productos/productos.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public clientes = 0;
  public productos = 0;
  public usuarios = 0;
  public roles: any = {};

  constructor(private clientesService: ClientesService, private usuariosService: UsuariosService, private productosService: ProductosService) { }


  ngOnInit(): void {
    this.cargarDetalles();
    this.admini();
  }

  public admini() {
    this.roles = JSON.parse(sessionStorage.getItem('currentUser'));
  }

  public cargarDetalles() {
    this.clientesService.listarClientes().subscribe(
      result => {
        this.clientes = result.length;
      }, error => {
        console.log(<any>error);
      }
    );
    this.usuariosService.listarUsuarios().subscribe(
      result => {
        this.usuarios = result.length;
      }, error => {
        console.log(<any>error);
      }
    );
    this.productosService.obtenerProductos().subscribe(
      result => {
        this.productos = result.length;
      }, error => {
        console.log(<any>error);
      }
    );
  }

  verPropinas(propinas) {
    propinas.showModal();
  }
  verAuditoria(auditoria) {
    auditoria.showModal();
  }
  cerrarCaja(cierreCaja) {
    cierreCaja.showModal();
  }

}




