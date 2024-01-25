import { Injectable } from '@nestjs/common';
import { MiLogger } from 'src/utils/salida';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { hit } from './busqueda.model';
import { toArray } from 'rxjs';

type QueryDslOperator = "and" | "or"; 
@Injectable()
export class BusquedaService {

    constructor( private readonly elasticSearch:ElasticsearchService){}

    async buscar(usuario: string, bus: string, pagina: number, bases: string, and: boolean, wild:boolean, fechaIni?:string, fechaFin?:string, departamento?:string, precision?:number, caso?:string ) {
        const tam = 10;
        let operator: QueryDslOperator = "or"; 
        if (and) operator = "and";
        
        const arr: string[] = bases.split(',');
        const ini = (pagina -1 ) * tam;
        const idFuncion = 2001;
        const descrFun = "Buscar un dato en las bases de datos";

        let minScore = 0.1
        
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

            if (precision){
               minScore = precision
            }

            if (caso){
                query.query.bool.must.push({
                    match: {
                        base2: {
                            query: caso.toLowerCase(),
                            operator: operator
                        }
                    }
                });
            }
    
            if (departamento) {
                query.query.bool.must.push({
                    match: {
                        departamento: {
                            query: departamento.toUpperCase(),
                            operator: operator
                        }
                    }
                });
            }
    
            console.log(minScore)

            const resul = await this.elasticSearch.search<hit>({
                index: arr,
                from: ini,
                size: tam,
                body: query,
                min_score: minScore,
                track_total_hits: true,
            });
            
            // Obtener el puntaje máximo de los resultados
            const maxScore = resul.hits.max_score;
            
            const scoreThreshold = maxScore * minScore;
            
            // Filtrar los resultados que tienen un puntaje superior al 90% del puntaje máximo
            const datos = resul.hits.hits
                .map(item => {
                    const porcentajeScore = item._score / maxScore * 100;
            
                    return {
                        _score: item._score,
                        _porcentaje: porcentajeScore,
                        ...item._source,
                    };
                })
                .filter(item => item._score >= scoreThreshold);
            
            // Obtener el total de resultados
            const totalResultados = resul.hits.total;
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
                resultados: datos,
                total: totalResultadosV,
            };
            
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
