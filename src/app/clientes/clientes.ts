export class Clientes{
    constructor(
        public idCliente: number,
        public telefonoC: string,
        public nombreCompleto: string,
        public direccionC: string,
        public empresa: string,
        public telefonoEmpresa: string,
		public cedula: string,
        public ciudad: string,
        public activo: boolean
    ){}
}