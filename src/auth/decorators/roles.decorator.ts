import { SetMetadata } from '@nestjs/common';

// Uso: @Roles('admin') o @Roles('client')
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);