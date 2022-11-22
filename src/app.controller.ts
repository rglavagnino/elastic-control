import { Controller, Get,Res,HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(    
    @Res() resp: Response) {
    const re = this.appService.obtenerSalud();
    return resp.status(HttpStatus.OK).json(re);
  }
}
