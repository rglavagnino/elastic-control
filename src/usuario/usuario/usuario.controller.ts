import { Controller, Post, Res, Headers,Body, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Response } from 'express';
import { tokenTemp } from 'src/utils/servidores';
import { obtenerStatusHttp } from 'src/utils/salida';

@Controller('usuario')
export class UsuarioController {


    constructor(
        private usuarioSrv: UsuarioService
    ){}



    @Post()
    async obtenerUsuarios(
        @Res() res: Response,
        @Headers('Authorization') token: string,
        @Headers('usuario') usuario: string,
        @Body('usuarioId') usuarioId: string,

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

          const sal = await this.usuarioSrv.obtenerDatosUsuario(usuario,usuarioId);

              const status = obtenerStatusHttp(sal);
              return res.status(status).json(sal);
    }
}
