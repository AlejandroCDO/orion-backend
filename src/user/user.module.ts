import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from '../pelicula/schema/pelicula.schema/user.schema';
import { ValoracionSchema } from '../pelicula/schema/pelicula.schema/valoracion.schema';
import { PeliculaSchema } from '../pelicula/schema/pelicula.schema/pelicula.schema';
import { AuthModule } from '../auth/auth.module';
import { ReservaSchema } from '../pelicula/schema/pelicula.schema/reserva.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Valoracion', schema: ValoracionSchema },
      { name: 'Reserva', schema: ReservaSchema },
      { name: 'Pelicula', schema: PeliculaSchema },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}