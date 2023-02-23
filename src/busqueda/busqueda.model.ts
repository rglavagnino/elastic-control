export interface busHit{
    hits:{
        hits:[

            _index:string,
            _source: hit
        ]
    }
}


export interface hit{
    baseFoto: string,
    base1: string,
    base2: string,
    base3: string,
    base4: string,
    base: string
}