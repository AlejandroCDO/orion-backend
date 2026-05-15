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

  async addPelicula(peliculaDto: PeliculaDto): Promise<ApiResponsePelicula> {
    const pelicula = new this.peliculaModel(peliculaDto);
    return pelicula.save();
  }

  async getPeliculas(): Promise<ApiResponsePelicula[]> {
    return this.peliculaModel.find().exec();
  }

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

  async getPeliculasPorTexto(texto: string): Promise<ApiResponsePelicula[]> {
    return this.peliculaModel.find({
      $or: [
        { titulo: { $regex: texto, $options: 'i' } },
        { director: { $regex: texto, $options: 'i' } },
      ]
    }).exec();
  }

  async getPeliculasPorGenero(genero: string): Promise<ApiResponsePelicula[]> {
    return this.peliculaModel.find({ genres: genero }).exec();
  }

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

  async getGenerosDisponibles(): Promise<string[]> {
    return this.peliculaModel.distinct('genres').exec();
  }
}