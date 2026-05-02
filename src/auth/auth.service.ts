import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto } from '../pelicula/dto/pelicula.dto/auth.dto';
import { User } from '../pelicula/interfaces/pelicula/pelicula.interface';

const ADMIN_ACCESS_CODE = 'SoyAdmin';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ status: boolean; message: string }> {
    const { email, password, nombre, apellidos, telefono } = registerDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException({
        status: false,
        message: 'Este correo electrónico ya está registrado',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role: 'client',
      nombre: nombre || '',
      apellidos: apellidos || '',
      telefono: telefono || '',
    });

    await newUser.save();

    return {
      status: true,
      message: 'Usuario registrado correctamente',
    };
  }

  async login(loginDto: LoginDto): Promise<{ status: boolean; token: string; role: string; userId: string }> {
    const { email, password, accessCode } = loginDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException({
        status: false,
        message: 'Correo o contraseña incorrectos',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException({
        status: false,
        message: 'Correo o contraseña incorrectos',
      });
    }

    // Si el usuario ya es admin, exigir el código siempre
    if (user.role === 'admin') {
      if (!accessCode || accessCode !== ADMIN_ACCESS_CODE) {
        throw new UnauthorizedException({
          status: false,
          message: 'Se requiere el código de acceso de administrador',
        });
      }
    }

    // Si es cliente pero manda código, verificarlo y promover a admin
    if (accessCode && user.role !== 'admin') {
      if (accessCode !== ADMIN_ACCESS_CODE) {
        throw new UnauthorizedException({
          status: false,
          message: 'Código de acceso de administrador incorrecto',
        });
      }
      user.role = 'admin';
      await (user as any).save();
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      status: true,
      token,
      role: user.role,
      userId: (user._id as any).toString(),
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException({ status: false, message: 'Usuario no encontrado' });
    }
    return user;
  }
}