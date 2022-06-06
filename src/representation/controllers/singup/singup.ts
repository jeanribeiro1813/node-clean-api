import {MissingParamsError,InvalidParamsError} from '../../errors'
import {badRequest,serverError} from '../../helpers/http-helpers'
import { Controller,HttpRequest, HttpResponse, EmailValidator, AddAccount } from '../singup/singup-protocols'


export class SingUpController implements Controller{

    //Criando uma variavel private , pois só vai pode mexer dentro da classe
    private readonly emailValidator:EmailValidator
    private readonly addAccount:AddAccount


    //Fazendo o constructor para injetar no teste
    //No qual recebe o emailValidator
    constructor(emailValidator:EmailValidator , addAccount: AddAccount){
        this.emailValidator = emailValidator
        this.addAccount = addAccount

    }
    handle(httpRequest: HttpRequest): HttpResponse{
        try{
        
            const requiredFields = ['name','email','password','passwordConfirmation']
        
            for (const field of requiredFields){
                if(!httpRequest.body[field]){
                    return badRequest(new MissingParamsError(field))
        
            }
        }


        const {name,email, password, passwordConfirmation} = httpRequest.body

        if(password !== passwordConfirmation){
            return badRequest( new InvalidParamsError('passwordConfirmation'))
        }

        //Pegando o email do body e validando se esta correto
        const isValid = this.emailValidator.isValid(email)
        if(!isValid){
            //Erro criado para o email
            return badRequest(new InvalidParamsError('email'))
        }

        const account = this.addAccount.add({
            name,
            email,
            password,
        })

        return{
            statusCode: 200,
            body: account,
        }

        } catch(error){

        return serverError();

    }
}   
}