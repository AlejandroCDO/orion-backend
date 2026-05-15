import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionService } from '../session/session.service';
import { CreateReservaDto } from '../pelicula/dto/pelicula.dto/reserva.dto';

@Injectable()
export class ReservaService {
  constructor(
    @InjectModel('Reserva') private readonly reservaModel: Model<any>,
    @InjectModel('Session') private readonly sessionModel: Model<any>,
    private readonly sessionService: SessionService,
  ) {}

  async createReserva(dto: CreateReservaDto): Promise<any> {
    await this.sessionService.ocuparAsientos(dto.sesionId, dto.asientosSeleccionados);
    const reserva = new this.reservaModel(dto);
    return reserva.save();
  }

  async getReservasByUser(usuarioId: string): Promise<any[]> {
    const reservas = await this.reservaModel
      .find({ usuarioId })
      .populate({
        path: 'sesionId',
        populate: { path: 'movieId', select: 'titulo posterURL' },
      })
      .sort({ fechaReserva: -1 })
      .exec();

    return reservas.filter(r => r.sesionId !== null);
  }

  async getReservaById(id: string): Promise<any> {
    const reserva = await this.reservaModel
      .findById(id)
      .populate({
        path: 'sesionId',
        populate: { path: 'movieId' },
      })
      .exec();

    if (!reserva) {
      throw new NotFoundException({ status: false, message: 'Reserva no encontrada' });
    }
    return reserva;
  }

  async getAllReservas(): Promise<any[]> {
    return this.reservaModel
      .find()
      .populate('usuarioId', 'email')
      .populate({
        path: 'sesionId',
        populate: { path: 'movieId', select: 'titulo' },
      })
      .exec();
  }

  async deleteReserva(id: string): Promise<any> {
    const deleted = await this.reservaModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException({ status: false, message: 'Reserva no encontrada para eliminar' });
    }
    return deleted;
  }

  async deleteReservasByUsuario(usuarioId: string): Promise<void> {
    await this.reservaModel.deleteMany({ usuarioId }).exec();
  }

  @Cron('0 3 * * *')
  async limpiarReservasCaducadas(): Promise<void> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const sessionesCaducadas = await this.sessionModel
      .find({ fecha: { $lt: hoy } })
      .select('_id')
      .exec();

    const sesionIds = sessionesCaducadas.map((s: any) => s._id);

    if (sesionIds.length === 0) return;

    const resultado = await this.reservaModel
      .deleteMany({ sesionId: { $in: sesionIds } })
      .exec();

  }
}