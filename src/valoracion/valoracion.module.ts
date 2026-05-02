import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValoracionController } from './valoracion.controller';
import { ValoracionService } from './valoracion.service';
import { ValoracionSchema } from '../pelicula/schema/pelicula.schema/valoracion.schema';
import { PeliculaSchema } from '../pelicula/schema/pelicula.schema/pelicula.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Valoracion', schema: ValoracionSchema },
      { name: 'Pelicula', schema: PeliculaSchema },
    ]),
    AuthModule,
  ],
  controllers: [ValoracionController],
  providers: [ValoracionService],
})
export class ValoracionModule {}