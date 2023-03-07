import { Module } from '@nestjs/common';
import { SaavController } from './saav.controller';
import { SaavService } from './saav.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SaavController],
  providers: [SaavService],
  imports:[
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '172.18.230.113',
      port: 1433,
      username: 'dac',
      password: '8v$2!Z740PQz',
      database: 'saav',
      synchronize: false,
      entities: [],
      extra: {
        trustServerCertificate: true,
      },
    }),
  ]
})
export class SaavModule {}
