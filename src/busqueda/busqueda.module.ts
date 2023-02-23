import { Module } from '@nestjs/common';
import { BusquedaController } from './busqueda.controller';
import { BusquedaService } from './busqueda.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { __ELASTICSERVER__ } from 'src/utils/servidores';

@Module({
  controllers: [BusquedaController],
  providers: [BusquedaService],
  imports:[
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: __ELASTICSERVER__,
        auth:{
          username: 'elastic',
          password: '!zeaalfa1'
        }
      })
    })
  ]
})
export class BusquedaModule {}
