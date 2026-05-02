import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Leer los roles permitidos del decorador @Roles(...)
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // Si la ruta no tiene @Roles, es pública para cualquier usuario autenticado
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException({
        status: false,
        message: 'No tienes permisos para realizar esta acción',
      });
    }

    return true;
  }
}