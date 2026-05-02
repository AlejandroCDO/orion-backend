import { Module } from '@nestjs/common';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { SessionModule } from '../session/session.module';
import { ReservaSchema } from '../pelicula/schema/pelicula.schema/reserva.schema';
import { SessionSchema } from '../pelicula/schema/pelicula.schema/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Reserva',
        schema: ReservaSchema,
        collection: 'reservas',
      },
      {
        name: 'Session',
        schema: SessionSchema,
      },
    ]),
    AuthModule,
    SessionModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}