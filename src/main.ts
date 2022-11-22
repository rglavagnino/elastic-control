import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



const _PUERTO_ = 5003
console.log("Iniciando en el puerto " + _PUERTO_)
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  await app.listen(_PUERTO_);
}
bootstrap();
