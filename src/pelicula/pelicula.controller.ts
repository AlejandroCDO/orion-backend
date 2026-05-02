import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PeliculaService } from './pelicula.service';
import { PeliculaDto } from './dto/pelicula.dto/pelicula.dto';

@Controller('/api/v2/peliculas')
export class PeliculaController {
  constructor(private readonly peliculaService: PeliculaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('agregar')
  async addPelicula(@Body() peliculaDto: PeliculaDto) {
    try {
      await this.peliculaService.addPelicula(peliculaDto);
      return {
        status: true,
        message: 'Película agregada correctamente',
      };
    } catch (error: any) {
      throw new BadRequestException({
        status: false,
        message: error.message,
      });
    }
  }

  @Get('')
  async getPeliculas() {
    try {
      const data = await this.peliculaService.getPeliculas();
      return {
        status: true,
        message: data, // Mantengo "message" para seguir tu estándar de noticias
      };
    } catch (error: any) {
      throw new BadRequestException({
        status: false,
        message: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('update/:id')
  async updatePelicula(@Param('id') id: string, @Body() peliculaDto: PeliculaDto) {
    try {
      await this.peliculaService.updatePelicula(id, peliculaDto);
      return {
        status: true,
        message: 'Película actualizada',
      };
    } catch (error: any) {
      throw new BadRequestException({
        status: false,
        message: error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('delete/:id')
  async deletePelicula(@Param('id') id: string) {
    try {
      await this.peliculaService.deletePelicula(id);
      return {
        status: true,
        message: 'Película eliminada',
      };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException({
        status: false,
        message: e.message,
      });
    }
  }

  @Get('unaPelicula/:id')
  async getPelicula(@Param('id') id: string) {
    try {
      const data = await this.peliculaService.getPeliculaById(id);
      return {
        status: true,
        pelicula: data,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        status: false,
        message: error.message,
      });
    }
  }

  @Get('buscarPeliculaToD/:tituloDirector')
  async getPeliculaPorTituloDirector(@Param('tituloDirector') tituloDirector: string) {
    try {
      const data = await this.peliculaService.getPeliculasPorTexto(tituloDirector);
      return {
        status: true,
        pelicula: data,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        status: false,
        message: error.message,
      });
    }
  }

  @Get('generos')
  async getGeneros() {
    try {
      const data = await this.peliculaService.getGenerosDisponibles();
      return {
        status: true,
        generos: data,
      };
    } catch (error: any) {
      throw new BadRequestException({
        status: false,
        message: error.message,
      });
    }
  }

  @Get('peliculasPorGenero/:genero')
  async getPeliculasPorGenero(@Param('genero') genero: string) {
    try {
      const data = await this.peliculaService.getPeliculasPorGenero(genero);
      return {
        status: true,
        pelicula: data,
      };
    } catch (error: any) {
      throw new BadRequestException({
        status: false,
        message: error.message,
      });
    }
  }
  @Post('agregar-bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async addPeliculasBulk(@Body() peliculas: PeliculaDto[]) {
    try {
      for (const pelicula of peliculas) {
        await this.peliculaService.addPelicula(pelicula);
      }
      return {
        status: true,
        message: `${peliculas.length} películas añadidas correctamente`,
      };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }
}