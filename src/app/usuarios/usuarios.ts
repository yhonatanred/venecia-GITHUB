export class Usuarios{
    constructor(
        public idUsuario: number,
		public nombre: string,
		public apellido: string,
		public user: string,
        public pass: string,
        public rol: string,
        public activo: boolean
    ){}
}