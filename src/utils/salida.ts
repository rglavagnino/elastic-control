import { obtenerVersion } from './version';
import { HttpStatus } from '@nestjs/common';


export interface salida{
    tipo:string,
    mensaje:string,
    datos:any[],
    debug:any
}
/**
 * Se prepara la salida con su codigo
 * @param resul la salida deseada
 */
export function obtenerStatusHttp(resul: salida) {
  let status;
  if (!resul) return HttpStatus.BAD_REQUEST;
  if (resul.tipo === 'Info' || resul.tipo === 'Exito') status = HttpStatus.OK;
  else status = HttpStatus.INTERNAL_SERVER_ERROR;
  return status;
}

/**
 *
 * @param usuario usuario que hizo la modificacin
 * @param funcion la funcion que se hace
 * @param operacion la operacion que esta haciendo
 * @param msg otros datos de
 */
function formarLog(usuario, funcion, operacion, msg, body: any) {
  const ahora = new Date();
  const sep = '|';
  return (
    ahora.toLocaleString() + sep +
    usuario + sep + funcion + sep + operacion + sep + msg +sep+ JSON.stringify(body)
  );
}

/**
 * Funciona como la salida estandar de mensaje
 * @param mensaje: El mensaje a poner en el frontend
 * @param tipo: Error: Hay un error en la aplicacion, Exito: existoso, Info: informacioncion
 * @param debug: Es un mensaje para debuguear
 * @param datos: son los datos
 */
function crearSalida(
  mensaje: string,
  tipo: string,
  debug: any,
  datos: any[],
): salida {
  let nuevaSalida: salida;
  nuevaSalida = {
    mensaje,
    tipo,
    debug,
    datos,
  };
  return nuevaSalida;
}

/**
 *
 * @param tipo 1 Infor, 2 Exito, 3 Error,
 * @returns Info, Exito, Error
 */
function obtenerTipo(tipo: number): string {
  if (tipo === 1) return 'Info';
  else if (tipo === 2) return 'Exito';
  else if (tipo === 3) return 'Error';
  else return 'NA';
}

/**
 *
 * @param msg
 */
function logger(msg: string) {
  const ahora = new Date();
  const ver = obtenerVersion();
  console.log(
    '[' + ver.version + ']' + ' ' + ahora.toLocaleString() + ' - ' + msg,
  );
}

function loggerId(usuario: string, msg: string, idFuncion: number) {
  const ahora = new Date();
  const ver = obtenerVersion();
  console.log(
    '[' +
      ver.version +
      ']' +
      ' [' +
      usuario +
      '] ' +
      ahora.toLocaleString() +
      ' - ' +
      idFuncion.toString() +
      ' - ' +
      msg,
  );
}

/**
 * ANCHOR salida y log
 * Crea la salida y de una vez el log
 * @param usuario
 * @param idFuncion
 * @param msg
 * @param datos
 * @param tipoRes
 */
function salidaYLog(
  usuario: string,
  idFuncion: number,
  msg: string,
  tipoRes: string,
  datos?: any[],
) {
  loggerId(usuario, msg, idFuncion);
  const salida = crearSalida(msg, tipoRes, '', datos);
  return salida;
}


export class MiLogger {
    constructor(
      private usuario: string,
      private idFuncion: number,
      private descrFuncion?: string,
    ) {}
  
    public crearLogBdd(msg: string, body?: any) {
      return formarLog(
        this.usuario,
        this.idFuncion,
        this.descrFuncion,
        msg,
        body,
      );
    }
  
    public crearLog(msg: string) {
      return loggerId(this.usuario, msg, this.idFuncion);
    }
  
    /**
     *
     * @param msg El mensaje que se desea escribier
     * @param tipoMsg  1 - info, 2 - exito, 3 - error
     * @param body
     * @returns
     */
    public crearLogYSalida(msg: string, tipoMsg: number, body?: any) {
      return salidaYLog(
        this.usuario,
        this.idFuncion,
        msg,
        obtenerTipo(tipoMsg),
        body,
      );
    }
  }
  