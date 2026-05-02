import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiResponsePelicula } from './interfaces/pelicula/pelicula.interface';
import { PeliculaDto } from './dto/pelicula.dto/pelicula.dto';

@Injectable()
export class PeliculaService {
  constructor(
    @InjectModel('Pelicula') private readonly peliculaModel: Model<ApiResponsePelicula>
  ) {}

  // 1. Crear una película
  async addPelicula(peliculaDto: PeliculaDto): Promise<ApiResponsePelicula> {
    const pelicula = new this.peliculaModel(peliculaDto);
    return pelicula.save();
  }

  // 2. Obtener todas las películas (Cartelera)
  async getPeliculas(): Promise<ApiResponsePelicula[]> {
    return this.peliculaModel.find().exec();
  }

  // 3. Obtener una película por ID (Detalle)
  async getPeliculaById(id: string): Promise<ApiResponsePelicula> {
    const pelicula = await this.peliculaModel.findById(id).exec();
    if (!pelicula) {
      throw new NotFoundException({
        status: false,
        message: 'No se ha encontrado la película',
      });
    }
    return pelicula;
  }

  // 4. Buscar películas por título o director (Buscador)
  async getPeliculasPorTexto(texto: string): Promise<ApiResponsePelicula[]> {
    return this.peliculaModel.find({
      $or: [
        { titulo: { $regex: texto, $options: 'i' } },
        { director: { $regex: texto, $options: 'i' } },
      ]
    }).exec();
  }

  // 5. Filtrar por género (Útil para filtros en Ionic)
  async getPeliculasPorGenero(genero: string): Promise<ApiResponsePelicula[]> {
    return this.peliculaModel.find({ genres: genero }).exec();
  }

  // 6. Actualizar película
  async updatePelicula(idPelicula: string, peliculaDto: PeliculaDto): Promise<ApiResponsePelicula> {
    const updatedPelicula = await this.peliculaModel.findByIdAndUpdate(
      idPelicula,
      { $set: peliculaDto },
      { new: true }
    ).exec();

    if (!updatedPelicula) {
      throw new NotFoundException({
        status: false,
        message: 'No se ha encontrado la película para actualizar',
      });
    }
    return updatedPelicula;
  }

  // 7. Borrar película
  async deletePelicula(idPelicula: string): Promise<any> {
    const deletedPelicula = await this.peliculaModel.findByIdAndDelete(idPelicula).exec();
    if (!deletedPelicula) {
      throw new NotFoundException({
        status: false,
        message: 'No se ha encontrado la película para eliminar',
      });
    }
    return deletedPelicula;
  }

  // 8. Obtener lista de géneros únicos (Para el desplegable del Admin)
  async getGenerosDisponibles(): Promise<string[]> {
    return this.peliculaModel.distinct('genres').exec();
  }
}