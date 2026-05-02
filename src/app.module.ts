import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PeliculaModule } from './pelicula/pelicula.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { ReservaModule } from './reserva/reserva.module';
import { UserModule } from './user/user.module';
import { ValoracionModule } from './valoracion/valoracion.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.URL as string),
    ScheduleModule.forRoot(),
    PeliculaModule,
    AuthModule,
    SessionModule,
    ReservaModule,
    UserModule,
    ValoracionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}