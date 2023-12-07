import { Injectable } from '@nestjs/common';
import { MiLogger } from 'src/utils/salida';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { hit } from './busqueda.model';
import { toArray } from 'rxjs';

type QueryDslOperator = "and" | "or"; 
@Injectable()
export class BusquedaService {

    constructor( private readonly elasticSearch:ElasticsearchService){}

    async buscar(usuario: string, bus: string, pagina: number, bases: string, and: boolean, wild:boolean, fechaIni?:string, fechaFin?:string, departamento?:string) {
        const tam = 10;
        let operator: QueryDslOperator = "or"; 
        if (and) operator = "and";
        
        const arr: string[] = bases.split(',');
        const ini = (pagina -1 ) * tam;
        const idFuncion = 2001;
        const descrFun = "Buscar un dato en las bases de datos";
        
        const log = new MiLogger(usuario, idFuncion, descrFun);
        log.crearLog('Buscando en bases ' + bus);
        let w = ''
        if (wild)  w = '*'
         const _bus = w + bus + w;
        //const _bus =  bus ;

        try {
            const query: any = {
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
                _source: ["_score", "base", "base1", "base2", "base3", "base4", "base5", "dia", "mes", "anio", "departamento", "baseFoto", "fecha", "base6"]
            };
    
            if (fechaIni && fechaFin) {
                query.query.bool.must.push({
                    range: {
                        fecha: {
                            gte: fechaIni,
                            lte: fechaFin,
                            format: "yyyy-M-d HH:mm:ss" // Ajusta el formato según el formato real de tu campo datetime
                        }
                    }
                });
            }
    
            if (departamento) {
                query.query.bool.must.push({
                    match: {
                        departamento: {
                            query: departamento.toUpperCase(),
                            operator: "and"
                        }
                    }
                });
            }
    
            const resul = await this.elasticSearch.search<hit>({
                index: arr,
                from: ini,
                size: tam,
                body: query
            });

            const datos = resul.hits.hits.map((item) => {
                const porcentajeScore = item._score / resul.hits.max_score * 100;
    
                return {
                    _score: item._score,
                    _porcentaje: porcentajeScore, // Nuevo campo con el porcentaje
                    ...item._source,
                };
            });
            const totalResultados = resul.hits.total
            let totalResultadosV = 0
            if (typeof totalResultados === 'number') {
                // Si es un número, devolverlo directamente
                totalResultadosV = totalResultados as number; 
            } else {
                // Si es un objeto SearchTotalHits, extraer el valor
                totalResultadosV = totalResultados.value;
            }
            const maxScore = resul.hits.max_score as number;
 
            const regreso = {
                resultados : datos,
                total: totalResultadosV
            }
            return log.crearLogYSalida(`Éxito en obtener los datos de la base ${operator}`, 2, regreso);
        } catch (error) {
            // Handle errors here
            log.crearLogYSalida(`Error en la búsqueda: ${error.message}`, 0, []);
        }
    }

    obtenerTotalResultados(total: number | { value: number }): number {
        if (typeof total === 'number') {
            // Si es un número, devolverlo directamente
            return total;
        } else {
            // Si es un objeto con la propiedad 'value', extraer el valor
            return total.value;
        }
    }

    
}
