import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MiLogger } from 'src/utils/salida';
import { elasticHit } from './usuario.model';

@Injectable()
export class UsuarioService {

    constructor(

        private readonly elasticSearch:ElasticsearchService
    ){}


    async obtenerDatosUsuario(usuario:string,usuarioId:string){
        const idFuncion = 1000
        const descrFun = "Obtener datos de un usuario"
        const log = new MiLogger(usuario,idFuncion,descrFun)
        log.crearLog('Buscando el usuario ' + usuarioId)
        const resul = await this.elasticSearch.search<elasticHit>({
            index:"usuarios",
            body:{
                query:{
                    match:{
                        "USUARIO": usuarioId
                    }
                }
            }
        })

        return log.crearLogYSalida("Exito en obtener usuario", 2, resul.hits.hits.map((item) => item._source))
    }
}
