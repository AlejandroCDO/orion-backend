import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateReservaDto } from '../pelicula/dto/pelicula.dto/reserva.dto';

@Controller('/api/v2/reservas')
@UseGuards(JwtAuthGuard)
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post('crear')
  async createReserva(@Body() dto: CreateReservaDto) {
    try {
      const data = await this.reservaService.createReserva(dto);
      return { status: true, message: 'Reserva creada correctamente', reserva: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Get('usuario/:usuarioId')
  async getReservasByUser(@Param('usuarioId') usuarioId: string) {
    try {
      const data = await this.reservaService.getReservasByUser(usuarioId);
      return { status: true, reservas: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Get(':id')
  async getReservaById(@Param('id') id: string) {
    try {
      const data = await this.reservaService.getReservaById(id);
      return { status: true, reserva: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Get('')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllReservas() {
    try {
      const data = await this.reservaService.getAllReservas();
      return { status: true, reservas: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Delete('cancelar/:id')
  async deleteReserva(@Param('id') id: string) {
    try {
      await this.reservaService.deleteReserva(id);
      return { status: true, message: 'Reserva cancelada correctamente' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({ status: false, message: error.message });
    }
  }
}