import { Response } from 'express';
import { tokenTemp } from 'src/utils/servidores';
import { obtenerStatusHttp } from 'src/utils/salida';
import { BusquedaService } from './busqueda.service';
import { Controller, Post, Res, Headers,Body, HttpStatus } from '@nestjs/common';


@Controller('busqueda')
export class BusquedaController {

    constructor( private busSrv:BusquedaService){}

    @Post()
    async buscar(
        @Res() res: Response,
        @Headers('Authorization') token: string,
        @Headers('usuario') usuario: string,
        @Body('bus') bus: string,
        @Body('pagina') pag: number,

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

          const sal = await this.busSrv.buscar(usuario,bus,pag);

              const status = obtenerStatusHttp(sal);
              return res.status(status).json(sal);
    }

    
}
