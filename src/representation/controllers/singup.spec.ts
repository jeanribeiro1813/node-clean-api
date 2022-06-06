import {SingUpController} from './singup'
import {MissingParamsError} from '../errors/missing-params-error'
import { InvalidParamsError } from '../errors/invalid-params-error';
import { EmailValidator } from '../protocols/email-validator';
import { ServerError } from '../errors/server-error';

//Interface para facilitar o que cada objeto recebe
interface SutTypes{
    sut: SingUpController,
    emailValidatorStub: EmailValidator
}

//Para Evitar qualquer dependencia e ficar mudando um teste por um , o ideal é fazer isso para deixar o codigo mais limpo
//Assim eu posso colocar quantas dependenciar eu quiser e não necessariamente preciso mudar em cada parte
const makeSut = ():SutTypes =>{

    //Criando uma classe e implementando da interface que foi criada em protocols
    class EmailValidatorStub implements EmailValidator{
        isValid(email:string):boolean{
            //Retornar ao video
            return true
        }
    }

    //Criando uma variavel recebendo a calsse criado acima especificamente para email
    const emailValidatorStub = new EmailValidatorStub()

    //Injetando dentro da clsse SingUpController , a variavel que recebe da classe EmailValidatorStub
    const sut =  new SingUpController(emailValidatorStub);
    return{
        sut,
        emailValidatorStub
    }
}

describe('SingUp Controller',() =>{
    test('Should return 400 if no name is provided',()=>{
        const {sut} = makeSut()
        const httpRequest = {
            body:{
                email:'any_email@mail.com',
                password:'any_password',
                passwordConfirmation: 'any_password'
            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('name'))

    })

    test('Should return 400 if no email is provided',()=>{
        const {sut} = makeSut()
        const httpRequest = {
            body:{
                name:'any_name',
                password:'any_password',
                passwordConfirmation: 'any_password'
            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))

    })

    test('Should return 400 if no password is provided',()=>{
        const {sut} = makeSut()
        const httpRequest = {
            body:{
                name:'any_name',
                email:'any_email@mail.com',
                passwordConfirmation: 'any_password'
            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))

    })

    test('Should return 400 if no password confirmation is provided',()=>{
        const {sut} = makeSut()
        const httpRequest = {
            body:{
                name:'any_name',
                email:'any_email@mail.com',
                password: 'any_password',

            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('passwordConfirmation'))

    })

    //Criando teste Especificamente para email , no caso receber se esta valido ou não

    test('Should return 400 if an invalid email is provided',()=>{
        const {sut, emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body:{
                name:'any_name',
                //Dando mais semantica para o teste , assim dando mais visu do que eu estou testando
                email:'invalid_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'

            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))

    })

    test('Should call EmailValidator with correct email',()=>{
        const {sut, emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body:{
                name:'any_name',
                //Dando mais semantica para o teste , assim dando mais visu do que eu estou testando
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'

            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')

    })

    test('Should return 500 if EmailValidator throws',()=>{
        class EmailValidatorStub implements EmailValidator{
            isValid(email:string):boolean{
                throw new Error()
            }
        }
    
        const emailValidatorStub = new EmailValidatorStub()
        const sut =  new SingUpController(emailValidatorStub);

        const httpRequest = {
            body:{
                name:'any_name',
                email:'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'

            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())

    })
})