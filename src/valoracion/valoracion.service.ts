import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ValoracionService {
  constructor(
    @InjectModel('Valoracion') private readonly valoracionModel: Model<any>,
    @InjectModel('Pelicula') private readonly peliculaModel: Model<any>,
  ) {}

  async getValoraciones(peliculaId: string): Promise<any> {
    const valoraciones = await this.valoracionModel
      .find({ peliculaId })
      .populate('userId', 'nombre apellidos email')
      .sort({ createdAt: -1 })
      .exec();
    return valoraciones;
  }

  async getMiValoracion(peliculaId: string, userId: string): Promise<any> {
    const valoracion = await this.valoracionModel
      .findOne({ peliculaId, userId })
      .exec();
    return valoracion;
  }

  async crearOActualizar(peliculaId: string, userId: string, puntuacion: number, comentario: string): Promise<any> {
    const pelicula = await this.peliculaModel.findById(peliculaId).exec();
    if (!pelicula) throw new NotFoundException({ status: false, message: 'Película no encontrada' });

    // Upsert — crea si no existe, actualiza si existe
    const valoracion = await this.valoracionModel.findOneAndUpdate(
      { peliculaId, userId },
      { puntuacion, comentario },
      { new: true, upsert: true }
    ).exec();

    await this.recalcularMedia(peliculaId);
    return valoracion;
  }

  async eliminar(peliculaId: string, userId: string): Promise<void> {
    const result = await this.valoracionModel
      .findOneAndDelete({ peliculaId, userId })
      .exec();
    if (!result) throw new NotFoundException({ status: false, message: 'Valoración no encontrada' });
    await this.recalcularMedia(peliculaId);
  }

  private async recalcularMedia(peliculaId: string): Promise<void> {
    const valoraciones = await this.valoracionModel.find({ peliculaId }).exec();
    const total = valoraciones.length;
    const media = total > 0
      ? valoraciones.reduce((sum: number, v: any) => sum + v.puntuacion, 0) / total
      : 0;

    await this.peliculaModel.findByIdAndUpdate(peliculaId, {
      mediaValoracion: Math.round(media * 10) / 10,
      totalValoraciones: total,
    }).exec();
  }
}