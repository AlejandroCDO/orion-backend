import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateSessionDto, UpdateSessionDto } from '../pelicula/dto/pelicula.dto/session.dto';


@Controller('/api/v2/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  // POST /api/v2/sessions/crear — Solo admin
  @Post('crear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createSession(@Body() dto: CreateSessionDto) {
    try {
      const data = await this.sessionService.createSession(dto);
      return { status: true, message: 'Sesión creada correctamente', session: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  // GET /api/v2/sessions — Pública
  @Get('')
  async getAllSessions() {
    try {
      const data = await this.sessionService.getAllSessions();
      return { status: true, message: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  // GET /api/v2/sessions/pelicula/:movieId — Pública
  @Get('pelicula/:movieId')
  async getSessionsByMovie(@Param('movieId') movieId: string) {
    try {
      const data = await this.sessionService.getSessionsByMovie(movieId);
      return { status: true, sessions: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  // GET /api/v2/sessions/:id — Pública
  @Get(':id')
  async getSessionById(@Param('id') id: string) {
    try {
      const data = await this.sessionService.getSessionById(id);
      return { status: true, session: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  // PUT /api/v2/sessions/update/:id — Solo admin
  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateSession(@Param('id') id: string, @Body() dto: UpdateSessionDto) {
    try {
      await this.sessionService.updateSession(id, dto);
      return { status: true, message: 'Sesión actualizada correctamente' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  // DELETE /api/v2/sessions/delete/:id — Solo admin
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteSession(@Param('id') id: string) {
    try {
      await this.sessionService.deleteSession(id);
      return { status: true, message: 'Sesión eliminada correctamente' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({ status: false, message: error.message });
    }
  }
}