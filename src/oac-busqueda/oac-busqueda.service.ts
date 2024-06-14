import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MiLogger } from 'src/utils/salida';
import { hitOac } from './oac-busqueda.model';

type QueryDslOperator = "and" | "or"; 
@Injectable()
export class OacBusquedaService {

    constructor( private readonly elasticSearch:ElasticsearchService){}



    async buscarOac(usuario: string, bus: string, pagina: number, bases: string, and: boolean){
        let operator: QueryDslOperator = "or"; 
        if (and) operator = "and";
        const tam = 10;
        const arr: string[] = bases.split(',');
        const ini = (pagina -1 ) * tam;
        const idFuncion = 2001;
        const descrFun = "Buscar un dato en las Consultas";

        const log = new MiLogger(usuario, idFuncion, descrFun);
        log.crearLog('Buscando en bases ' + bus);
        let w = ''
        const _bus = w + bus + w;

        let query:any =   {
            query: {
                bool: {
                    must: [
                        {
                            query_string: {
                                query: _bus,
                                default_operator: operator
                            }
                        }
                    ]
                }
            },
            _source: ["nombre", "archivo", "consulta", "departamento", "año", "correlativo", "persona", "documento_ident", "vehiculo", "tags"]
        };

        const tot =  await this.elasticSearch.search<hitOac>({
            index: arr,
            body: query,
            track_total_hits: true,
            from: ini,
            size: tam,
        });
        const results = tot.hits.hits.map(hit => hit._source);

        const totalResultados = tot.hits.total;
            let totalResultadosV = 0;
            
            if (typeof totalResultados === 'number') {
                // Si es un número, devolverlo directamente
                totalResultadosV = totalResultados;
            } else {
                // Si es un objeto SearchTotalHits, extraer el valor
                totalResultadosV = totalResultados.value;
            }
            
            // Crear el objeto de retorno
            const regreso = {
                resultados: results,
                total: totalResultadosV,
            };
        return log.crearLogYSalida(`Éxito en obtener los datos de la base ${arr}`, 2, regreso);

    }
}
