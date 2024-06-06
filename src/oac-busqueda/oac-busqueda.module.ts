import { Module } from '@nestjs/common';
import { OacBusquedaController } from './oac-busqueda.controller';
import { OacBusquedaService } from './oac-busqueda.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { __ELASTICSERVER__ } from 'src/utils/servidores';

@Module({
  controllers: [OacBusquedaController],
  providers: [OacBusquedaService],
  imports:[
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: __ELASTICSERVER__,
        auth:{
          username: 'elastic',
          password: '6p85NdcZ'
        }
      })
    })
  ]
})
export class OacBusquedaModule {}
