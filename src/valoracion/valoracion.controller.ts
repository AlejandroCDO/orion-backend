import { Controller, Get, Post, Delete, Param, Body, UseGuards, BadRequestException, NotFoundException, Req } from '@nestjs/common';
import { ValoracionService } from './valoracion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CrearValoracionDto } from '../pelicula/dto/pelicula.dto/valoracion.dto';

@Controller('/api/v2/valoraciones')
export class ValoracionController {
  constructor(private readonly valoracionService: ValoracionService) {}

  @Get(':peliculaId')
  async getValoraciones(@Param('peliculaId') peliculaId: string) {
    try {
      const data = await this.valoracionService.getValoraciones(peliculaId);
      return { status: true, valoraciones: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Get(':peliculaId/mia/:userId')
  @UseGuards(JwtAuthGuard)
  async getMiValoracion(
    @Param('peliculaId') peliculaId: string,
    @Param('userId') userId: string,
  ) {
    try {
      const data = await this.valoracionService.getMiValoracion(peliculaId, userId);
      return { status: true, valoracion: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Post(':peliculaId/:userId')
  @UseGuards(JwtAuthGuard)
  async crearOActualizar(
    @Param('peliculaId') peliculaId: string,
    @Param('userId') userId: string,
    @Body() body: CrearValoracionDto,
  ) {
    try {
      const data = await this.valoracionService.crearOActualizar(
        peliculaId, userId, body.puntuacion, body.comentario || ''
      );
      return { status: true, valoracion: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Delete(':peliculaId/:userId')
  @UseGuards(JwtAuthGuard)
  async eliminar(
    @Param('peliculaId') peliculaId: string,
    @Param('userId') userId: string,
  ) {
    try {
      await this.valoracionService.eliminar(peliculaId, userId);
      return { status: true, message: 'Valoración eliminada' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }
}