export interface User {
  _id: string;
  email: string;
  password: string;
  role: 'client' | 'admin';
  accessCode?: string;
}

export interface ApiResponsePelicula {
  _id: string;
  titulo: string;
  sinopsis: string;
  genres: string[];
  director: string;
  year: number;
  posterURL: string;
  duracion: string;
  clasEdad: '+0' | '+7' | '+12' | '+16' | '+18';
}

export interface Precio {
  adulto: number;
  reducido: number;
  jubilado: number;
}

export interface ApiResponseSession {
  _id: string;
  movieId: string | ApiResponsePelicula;
  fecha: Date;
  hora: string;
  sala: string;
  precio: Precio;
  asientos: boolean[][];
}

export interface Entradas {
  adulto: number;
  reducido: number;
  jubilado: number;
}

export interface ApiResponseReserva {
  _id: string;
  usuarioId: string;
  sesionId: string | ApiResponseSession;
  entradas: Entradas;
  asientosSeleccionados: string[];
  totalPagado: number;
  fechaReserva: Date;
}