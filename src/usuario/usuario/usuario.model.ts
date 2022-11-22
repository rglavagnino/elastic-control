export interface elasticHit{
    hits:{
        hits:[

            _index:string,
            _source: usuario
        ]
    }
}

export interface usuario{
    ID_EMPLEADO: string,
    NIP: string,
    NOMBRE: string,
    EDAD: string,
    TELEFONO: string,
    CORREO_ELECTRONICO: string,
    UBICACION: string,
    USUARIO: string,
    PUESTO_NOMINAL: string,
    REGLON: string,
    PUESTO_FUNCIONAL: string,
    DEPENDENCIA_FUNCIONAL: string,
    GRUPO: string,
    SUPERIOR: string,
    ESTADO: string,
    DIRFOTO: string,
}