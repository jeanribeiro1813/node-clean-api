import {HttpRequest, HttpResponse} from '../protocols/http'
import {MissingParamsError} from '../errors/missing-params-error'
import {badRequest} from '../helpers/http-helpers'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamsError } from '../errors/invalid-params-error';
import { ServerError } from '../errors/server-error';


export class SingUpController implements Controller{

    //Criando uma variavel private , pois só vai pode mexer dentro da classe
    private readonly emailValidator:EmailValidator

    //Fazendo o constructor para injetar no teste
    //No qual recebe o emailValidator
    constructor(emailValidator:EmailValidator){
        this.emailValidator = emailValidator

    }
    handle(httpRequest: HttpRequest): HttpResponse{
        try{
        const requiredFields = ['name','email','password','passwordConfirmation']
    
        for (const field of requiredFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamsError(field))
    
        }
    }

    //Pegando o email do bodu e validando se esta correto
    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    if(!isValid){
        //Erro criado para o email
        return badRequest(new InvalidParamsError('email'))
    }

    } catch(error){

        return{
            statusCode: 500,
            body:new ServerError
        }

    }
}   
}