//Não importa qual foi o erro , o importante e colocar que foi erro no servidor apenas
//Por isso que não passo parametros

export class ServerError extends Error{
    constructor(){
        super (`Internal Server Error`)
        this.name = 'ServerError'
    }
}