import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { SessionSchema } from '../pelicula/schema/pelicula.schema/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Session',
        schema: SessionSchema,
        collection: 'sessions',
      },
    ]),
    AuthModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}