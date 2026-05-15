import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../pelicula/dto/pelicula.dto/auth.dto';

@Controller('/api/v2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error: any) {
      throw new BadRequestException({ status: false, message: error.message });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException({ status: false, message: error.message });
    }
  }
}