import { Injectable } from '@nestjs/common';
import { MiLogger } from './utils/salida';
import { obtenerVersion } from './utils/version';

@Injectable()
export class AppService {
  obtenerSalud(){

    let ver = obtenerVersion()
    let salidas:any[] = []
    salidas.push(ver)
    console.log(ver)

    let salida = {"MENSAJE":'Estoy vivo',"ESTADO" :'EXITO',"ERROR":'',"VERSION": ver}
    const log = new MiLogger("ANONYMOUS",1,"VIVO")
    log.crearLog("Verificando si esta vivo la aplicacion")
    return salida


  }
}
