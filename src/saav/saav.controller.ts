import { Response } from 'express';
import { tokenTemp } from 'src/utils/servidores';
import { obtenerStatusHttp } from 'src/utils/salida';
import { Controller, Post, Put, Res, Headers,Body, HttpStatus } from '@nestjs/common';
import { SaavService } from './saav.service';

@Controller('saav')
export class SaavController {

    constructor( private saaSrv: SaavService){}

    @Post()
    async buscar(
        @Res() res: Response,
        @Headers('Authorization') token: string,
        @Headers('usuario') usuario: string,
        @Body('nosesion') nos: string,
        @Body('linea') lin: string,
        
    ){

        if (!token || !usuario) {
            return res
              .status(HttpStatus.FORBIDDEN)
              .json({ msg: 'Falta la autenticación', flt: 'No seas ese tipo' });
          }
      
          if (token !== tokenTemp)
            return res
              .status(HttpStatus.FORBIDDEN)
              .json({ msg: 'No dijistes la palabra magica' });

          const sal = await this.saaSrv.obtenerSesion(usuario,nos,lin);

              const status = obtenerStatusHttp(sal);
              return res.status(status).json(sal);
    }
}
