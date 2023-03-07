import { Injectable } from '@nestjs/common';
import { MiLogger } from 'src/utils/salida';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { hit } from './busqueda.model';

@Injectable()
export class BusquedaService {

    constructor( private readonly elasticSearch:ElasticsearchService){}

    async buscar(usuario:string, bus:string, pagina:number, bases:string){
        const tam = 10
        const arr: string[] = bases.split(',');
        const ini = pagina * tam
        const idFuncion = 2001
        const descrFun = "Buscar un dato en las bases de datos"
        const log = new MiLogger(usuario,idFuncion,descrFun)
        log.crearLog('Buscando en bases ' + bus)
        const _bus = "*" + bus + "*"
        const resul = await this.elasticSearch.search<hit>({
            index:arr,//["dacs","saav","rutpdac"],
            from: ini,
            size: tam,
            body:{
                query:{
                   query_string:{
                    "query": _bus
                    
                   }
                }
            }
            ,_source:["base1","base2","base3","base4","baseFoto",]
        })

        return log.crearLogYSalida("Exito en obtener los datos de la base", 2, resul.hits.hits.map((item) => item._source))
 
    }
}
