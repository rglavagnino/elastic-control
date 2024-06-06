import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario/usuario.module';
import { BusquedaModule } from './busqueda/busqueda.module';
import { SaavModule } from './saav/saav.module';
import { OacBusquedaModule } from './oac-busqueda/oac-busqueda.module';

@Module({
  imports: [UsuarioModule,ConfigModule, BusquedaModule, SaavModule, OacBusquedaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
