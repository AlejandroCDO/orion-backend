import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    @InjectModel('Valoracion') private readonly valoracionModel: Model<any>,
    @InjectModel('Reserva') private readonly reservaModel: Model<any>,
    @InjectModel('Pelicula') private readonly peliculaModel: Model<any>,
  ) {}

  async getFavs(userId: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .populate('favs', 'titulo posterURL year director genres clasEdad duracion sinopsis')
      .exec();
    if (!user) throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });
    return user.favs;
  }

  async toggleFav(userId: string, peliculaId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });

    const index = user.favs.findIndex((id: any) => id.toString() === peliculaId);
    if (index === -1) {
      user.favs.push(peliculaId);
    } else {
      user.favs.splice(index, 1);
    }
    await user.save();
    return user.favs;
  }

  async getWatchlist(userId: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .populate('watchlist', 'titulo posterURL year director genres clasEdad duracion sinopsis')
      .exec();
    if (!user) throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });
    return user.watchlist;
  }

  async toggleWatchlist(userId: string, peliculaId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });

    const index = user.watchlist.findIndex((id: any) => id.toString() === peliculaId);
    if (index === -1) {
      user.watchlist.push(peliculaId);
    } else {
      user.watchlist.splice(index, 1);
    }
    await user.save();
    return user.watchlist;
  }

  async getPerfil(userId: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .select('-password -favs -watchlist')
      .exec();
    if (!user) throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });
    return user;
  }

  async updatePerfil(userId: string, body: any): Promise<any> {
    const camposPermitidos = ['nombre', 'apellidos', 'telefono', 'email'];
    const update: any = {};
    camposPermitidos.forEach(campo => {
      if (body[campo] !== undefined) update[campo] = body[campo];
    });

    const user = await this.userModel
      .findByIdAndUpdate(userId, update, { new: true })
      .select('-password -favs -watchlist')
      .exec();
    if (!user) throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });
    return user;
  }

  async cambiarPassword(userId: string, passwordActual: string, passwordNueva: string): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });

    const coincide = await bcrypt.compare(passwordActual, user.password);
    if (!coincide) {
      throw new BadRequestException({ status: false, message: 'La contraseña actual no es correcta' });
    }

    if (passwordNueva.length < 6) {
      throw new BadRequestException({ status: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }

    user.password = await bcrypt.hash(passwordNueva, 10);
    await user.save();
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });

    await this.valoracionModel.deleteMany({ userId }).exec();
    await this.reservaModel.deleteMany({ usuarioId: userId }).exec();

    const peliculasAfectadas = await this.peliculaModel
      .find({ _id: { $in: result.favs } })
      .exec();

    for (const pelicula of peliculasAfectadas) {
      await this.recalcularMedia(pelicula._id.toString());
    }
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

  async getAllUsers(): Promise<any> {
    return this.userModel
      .find({ role: 'client' })
      .select('-password -favs -watchlist')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getValoracionesUsuario(userId: string): Promise<any> {
    const valoraciones = await this.valoracionModel
      .find({ userId })
      .populate('peliculaId', 'titulo posterURL')
      .sort({ createdAt: -1 })
      .exec();
    return valoraciones;
  }
}