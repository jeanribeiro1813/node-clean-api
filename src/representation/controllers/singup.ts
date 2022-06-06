import {MissingParamsError,InvalidParamsError} from '../errors'
import {badRequest,serverError} from '../helpers/http-helpers'
import { Controller,EmailValidator,HttpRequest, HttpResponse } from '../protocols'


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

        if(httpRequest.body.password !== httpRequest.body.passwordConfirmation){
            return badRequest( new InvalidParamsError('passwordConfirmation'))
        }

        //Pegando o email do body e validando se esta correto
        const isValid = this.emailValidator.isValid(httpRequest.body.email)
        if(!isValid){
            //Erro criado para o email
            return badRequest(new InvalidParamsError('email'))
        }

        } catch(error){

        return serverError();

    }
}   
}