import { Response } from 'express';
import { tokenTemp } from 'src/utils/servidores';
import { obtenerStatusHttp } from 'src/utils/salida';

import { Controller, Post, Res, Headers,Body, HttpStatus } from '@nestjs/common';
import { OacBusquedaService } from './oac-busqueda.service';

@Controller('oac')
export class OacBusquedaController {



    constructor( private busSrv:OacBusquedaService){}

    @Post()
    async buscar(
      @Res() res: Response,
      @Headers('Authorization') token: string,
      @Headers('usuario') usuario: string,
      @Body('bus') bus: string,
      @Body('pagina') pag: number,
      @Body('bases') bases: string,
      @Body('condicionante') cond : string,

    ){

        if (!token || !usuario) {
            return res
              .status(HttpStatus.FORBIDDEN)
              .json({ msg: 'Falta la autenticación', flt: 'No seas ese tipo' });
          }
      
          if (token !== tokenTemp)
          {
            return res
            .status(HttpStatus.FORBIDDEN)
            .json({ msg: 'No dijistes la palabra magica' });
          }

         
          if (!cond) 
            cond = 'or'
          cond = cond.toUpperCase()
          let condi = false
          if (cond == 'OR') 
            condi = false
          else 
            condi = true
        
          const sal = await this.busSrv.buscarOac(usuario,bus,pag, bases, condi);

              const status = obtenerStatusHttp(sal);
              return res.status(status).json(sal);
    }

    
}
