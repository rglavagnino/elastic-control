import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { MiLogger } from 'src/utils/salida';

@Injectable()
export class SaavService {

    constructor(@InjectDataSource() private dataSource: DataSource,) {}


    async obtenerSesion (usuario:string, no_sesion:string, linea:string) {

        const idFuncion = 2001
        const descrFun = "Buscar un dato en las bases de datos"
        const log = new MiLogger(usuario,idFuncion,descrFun)
        log.crearLog('Buscando en saav ' + no_sesion + ' ' + linea)


        let s = await this.dataSource.query(
            `
            select   no_sesion,fecha_hora_inicio, ss.nombre as sentido
, s.numero_asociado as numeroAsociado
, claUme.nombre as clasificacionUme
, sl.linea as linea, sl.objetivo as objetivo, d.nombre
,  c.departamento + '-' + convert(varchar(max), c.año) + '-' + convert(varchar(max), c.correlativo) as casoDac
,s.id
, comentario = (select sc.descripcion from saav.dbo.sesiones_comentarios sc where s.id = sc.sesion_id  and sc.tipo_id = 3 )
, sms = (select sc.descripcion from saav.dbo.sesiones_comentarios sc where s.id = sc.sesion_id  and sc.tipo_id = 5 )
,c.año, s.sinopsis
from saav.dbo.Sesiones s 
inner join saav.dbo.Desplegados d on d.id = s.desplegado_id
inner join saav.dbo.Casos c on c.id = d.caso_id
inner join saav.dbo.sesion_sentido ss on ss.id = s.sentido_id
inner join saav.dbo.sesion_clasificacion cla on cla.id = s.clasificacion_dac_id
inner join saav.dbo.sesion_clasificacion claUme on claUme.id = s.clasificacion_ume_id
inner join saav.dbo.sesion_linea sl on sl.id = s.linea_id
where d.activo = 1 and c.activo = 1 and no_sesion <> '-1'
and s.desplegado_id <> -1
            and no_sesion = ` + no_sesion + " and linea = '" +linea +"'"
         
        )

        return log.crearLogYSalida("Exito en obtener los datos de la base", 2, s)
     }


}
