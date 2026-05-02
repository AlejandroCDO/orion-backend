import { Controller, Get, Post, Put, Delete, Param, Body,
  UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/api/v2/users')
export class UserController {

  constructor(private readonly userService: UserService) {}

  // GET /api/v2/users — todos los usuarios (admin)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    try {
      const data = await this.userService.getAllUsers();
      return { status: true, usuarios: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  // GET /api/v2/users/:userId/valoraciones — reseñas de un usuario (admin)
  @Get(':userId/valoraciones')
  @UseGuards(JwtAuthGuard)
  async getValoracionesUsuario(@Param('userId') userId: string) {
    try {
      const data = await this.userService.getValoracionesUsuario(userId);
      return { status: true, valoraciones: data };
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Get(':userId/perfil')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Param('userId') userId: string) {
    try {
      const data = await this.userService.getPerfil(userId);
      return { status: true, perfil: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Put(':userId/perfil')
  @UseGuards(JwtAuthGuard)
  async updatePerfil(@Param('userId') userId: string, @Body() body: any) {
    try {
      const data = await this.userService.updatePerfil(userId, body);
      return { status: true, perfil: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('userId') userId: string) {
    try {
      await this.userService.deleteUser(userId);
      return { status: true, message: 'Usuario eliminado correctamente' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Get(':userId/favs')
  @UseGuards(JwtAuthGuard)
  async getFavs(@Param('userId') userId: string) {
    try {
      const data = await this.userService.getFavs(userId);
      return { status: true, favs: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Post(':userId/favs/:peliculaId')
  @UseGuards(JwtAuthGuard)
  async toggleFav(@Param('userId') userId: string, @Param('peliculaId') peliculaId: string) {
    try {
      const data = await this.userService.toggleFav(userId, peliculaId);
      return { status: true, favs: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Get(':userId/watchlist')
  @UseGuards(JwtAuthGuard)
  async getWatchlist(@Param('userId') userId: string) {
    try {
      const data = await this.userService.getWatchlist(userId);
      return { status: true, watchlist: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Post(':userId/watchlist/:peliculaId')
  @UseGuards(JwtAuthGuard)
  async toggleWatchlist(@Param('userId') userId: string, @Param('peliculaId') peliculaId: string) {
    try {
      const data = await this.userService.toggleWatchlist(userId, peliculaId);
      return { status: true, watchlist: data };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Put(':userId/password')
  @UseGuards(JwtAuthGuard)
  async cambiarPassword(
    @Param('userId') userId: string,
    @Body() body: { passwordActual: string; passwordNueva: string }
  ) {
    try {
      await this.userService.cambiarPassword(userId, body.passwordActual, body.passwordNueva);
      return { status: true, message: 'Contraseña actualizada correctamente' };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }
}