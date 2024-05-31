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
      @Body('bases') bases: string,
      @Body('wild') wild:boolean,
      @Body('fecIni') fecini:string,
      @Body('fecFin') fecfin:string,
      @Body('departamento') depto:string,
      @Body('precision') pres: number,
      @Body('caso') caso:string,
      @Body('casoMP') casoMP:string,
      @Body('fiscalia') fiscalia:string,
      @Body('tipoPersona') tipoPersona: string,
      @Body('condicionante') cond : string,
      @Body('fecIniDen') fecInDen: string,
      @Body('fecFinDen') fecFinDen: string,
      @Body('fecIniHec') fecInHec:string,
      @Body('fecFinHec') fecFinHec: string


    ){
      console.log(fecInDen,fecFinDen)
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
        
          const sal = await this.busSrv.buscar(usuario,bus,pag, bases, condi,wild,fecini,fecfin,depto,pres,caso, casoMP,fiscalia, tipoPersona, fecInDen, fecFinDen, fecInHec, fecFinHec);

              const status = obtenerStatusHttp(sal);
              return res.status(status).json(sal);
    }

    
}
