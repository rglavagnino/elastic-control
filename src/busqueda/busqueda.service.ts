import { Injectable } from '@nestjs/common';
import { MiLogger } from 'src/utils/salida';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { hit } from './busqueda.model';



@Injectable()
export class BusquedaService {

    constructor( private readonly elasticSearch:ElasticsearchService){}

    async buscar(usuario:string, bus:string, pagina:number, bases:string, and:boolean){
        const tam = 10
        
        const arr: string[] = bases.split(',');
        const ini = pagina * tam
        const idFuncion = 2001
        const descrFun = "Buscar un dato en las bases de datos"
        const log = new MiLogger(usuario,idFuncion,descrFun)
        log.crearLog('Buscando en bases ' + bus)
        const _bus = "*" + bus + "*"
        if (and){
            const resul = await this.elasticSearch.search<hit>({
                index: arr, // ["dacs", "saav", "rutpdac"],
                from: ini,
                size: tam,
                body: {
                    query: {
                        query_string: {
                            "query": _bus, // Cambia "_bus" a la condición con "AND"
                            "default_operator": "AND" // Establece el operador predeterminado como "AND"
                        }
                    },
                    _source: ["base","base1", "base2", "base3", "base4", "base5", "dia","mes","anio","departamento", "baseFoto"]
                }
            });
            return log.crearLogYSalida("Exito en obtener los datos de la base <and>", 2, resul.hits.hits.map((item) => item._source))
            
        } else {
            const resul = await this.elasticSearch.search<hit>({
                index: arr, // ["dacs", "saav", "rutpdac"],
                from: ini,
                size: tam,
                body: {
                    query: {
                        query_string: {
                            "query": _bus
                        }
                    },
                    // aggs: {
                    //     unique_values: {
                    //         terms: {
                    //             field: "base3",
                    //             size: 1 // Tamaño máximo para la lista de términos únicos
                    //         }
                    //     }
                    // },
                    _source: ["base","base1", "base2", "base3", "base4", "base5", "dia","mes","anio","departamento", "baseFoto"]
                }
            });
    
            return log.crearLogYSalida("Exito en obtener los datos de la base", 2, resul.hits.hits.map((item) => item._source))
     
        }

    }
}
