import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario/usuario.module';

@Module({
  imports: [UsuarioModule,ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
