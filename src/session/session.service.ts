import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSessionDto, UpdateSessionDto } from '../pelicula/dto/pelicula.dto/session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<any>,
  ) {}

  // 1. Crear una sesión (Solo admin)
  async createSession(dto: CreateSessionDto): Promise<any> {
    // Generamos una matriz de asientos si no se envía
    // Por defecto: 8 filas x 10 columnas = 80 asientos, todos disponibles (false = libre)
    const asientos = dto.asientos && dto.asientos.length > 0
      ? dto.asientos
      : Array.from({ length: 8 }, () => Array(10).fill(false));

    const session = new this.sessionModel({ ...dto, asientos });
    return session.save();
  }

  // 2. Obtener todas las sesiones
  async getAllSessions(): Promise<any[]> {
    return this.sessionModel.find().populate('movieId', 'titulo posterURL').exec();
  }

  // 3. Obtener sesiones de una película concreta
  async getSessionsByMovie(movieId: string): Promise<any[]> {
    return this.sessionModel
      .find({ movieId })
      .populate('movieId', 'titulo posterURL duracion')
      .exec();
  }

  // 4. Obtener una sesión por ID (con detalle de asientos)
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

  // 5. Actualizar una sesión (Solo admin)
  async updateSession(id: string, dto: UpdateSessionDto): Promise<any> {
    const updated = await this.sessionModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException({ status: false, message: 'Sesión no encontrada para actualizar' });
    }
    return updated;
  }

  // 6. Eliminar una sesión (Solo admin)
  async deleteSession(id: string): Promise<any> {
    const deleted = await this.sessionModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException({ status: false, message: 'Sesión no encontrada para eliminar' });
    }
    return deleted;
  }

  // 7. Marcar asiento como ocupado (lo llama ReservaService internamente)
  async ocuparAsientos(sessionId: string, asientos: string[]): Promise<void> {
    const session = await this.sessionModel.findById(sessionId).exec();
    if (!session) {
      throw new NotFoundException({ status: false, message: 'Sesión no encontrada' });
    }

    // Los asientos vienen como "A1", "B3", etc.
    // Fila = letra (A=0, B=1...), Columna = número - 1
    for (const asiento of asientos) {
      const fila = asiento.charCodeAt(0) - 65; // 'A' = 65 en ASCII
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

    // markModified es necesario porque Mongoose no detecta cambios en arrays anidados
    session.markModified('asientos');
    await session.save();
  }
}