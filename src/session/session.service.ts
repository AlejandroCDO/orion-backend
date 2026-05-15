import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto, UpdateSessionDto } from '../pelicula/dto/pelicula.dto/session.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<any>,
  ) {}

  async createSession(dto: CreateSessionDto): Promise<any> {
    const asientos = dto.asientos && dto.asientos.length > 0
      ? dto.asientos
      : Array.from({ length: 8 }, () => Array(10).fill(false));

    const session = new this.sessionModel({ ...dto, asientos });
    return session.save();
  }

  async getAllSessions(): Promise<any[]> {
    return this.sessionModel.find().populate('movieId', 'titulo posterURL').exec();
  }

  async getSessionsByMovie(movieId: string): Promise<any[]> {
    return this.sessionModel
      .find({ movieId })
      .populate('movieId', 'titulo posterURL duracion')
      .exec();
  }

  async getSessionById(id: string): Promise<any> {
    const session = await this.sessionModel
      .findById(id)
      .populate('movieId')
      .exec();

    if (!session) {
      throw new NotFoundException({ status: false, message: 'Sesión no encontrada' });
    }
    return session;
  }

  async updateSession(id: string, dto: UpdateSessionDto): Promise<any> {
    const updated = await this.sessionModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException({ status: false, message: 'Sesión no encontrada para actualizar' });
    }
    return updated;
  }

  async deleteSession(id: string): Promise<any> {
    const deleted = await this.sessionModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException({ status: false, message: 'Sesión no encontrada para eliminar' });
    }
    return deleted;
  }

  async ocuparAsientos(sessionId: string, asientos: string[]): Promise<void> {
    const session = await this.sessionModel.findById(sessionId).exec();
    if (!session) {
      throw new NotFoundException({ status: false, message: 'Sesión no encontrada' });
    }

    for (const asiento of asientos) {
      const fila = asiento.charCodeAt(0) - 65;
      const columna = parseInt(asiento.slice(1)) - 1;

      if (session.asientos[fila] && session.asientos[fila][columna] !== undefined) {
        if (session.asientos[fila][columna] === true) {
          throw new BadRequestException({
            status: false,
            message: `El asiento ${asiento} ya está ocupado`,
          });
        }
        session.asientos[fila][columna] = true;
      }
    }

    session.markModified('asientos');
    await session.save();
  }

  @Cron('0 3 * * *')
  async limpiarSesionesCaducadas(): Promise<void> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const resultado = await this.sessionModel
      .deleteMany({ fecha: { $lt: hoy } })
      .exec();

    console.log(`[CRON] Sesiones caducadas eliminadas: ${resultado.deletedCount}`);
  }
}