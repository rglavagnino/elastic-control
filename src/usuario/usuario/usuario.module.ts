import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { __ELASTICSERVER__ } from 'src/utils/servidores';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  imports:[
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: __ELASTICSERVER__
      })
    })
  ]
})
export class UsuarioModule {}
