import { Module } from '@nestjs/common';
import { PeliculaController } from './pelicula.controller';
import { PeliculaService } from './pelicula.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PeliculaSchema } from './schema/pelicula.schema/pelicula.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Pelicula',
        schema: PeliculaSchema,
        collection: 'pelicula',
      },
    ]),
    AuthModule,
  ],
  controllers: [PeliculaController],
  providers: [PeliculaService],
})
export class PeliculaModule {}