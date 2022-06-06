import {SingUpController} from './singup'
import { InvalidParamsError, MissingParamsError, ServerError} from '../errors';
import { EmailValidator } from '../protocols';

//Interface para facilitar o que cada objeto recebe
interface SutTypes{
    sut: SingUpController,
    emailValidatorStub: EmailValidator
}

//Criando uma classe e implementando da interface que foi criada em protocols
//Fazendo o mesmo esquema de fazer um factor para facilitar a abordagem caso precise utilizar mais de um lugar
const makeEmailValidator = (): EmailValidator =>{
    class EmailValidatorStub implements EmailValidator{
        //Validar se o email e valido ou não 
        isValid(email:string):boolean{
            return true
        }
    }
    return new EmailValidatorStub
}


//Fazendo o mesmo esquema de fazer um factor para facilitar a abordagem caso precise utilizar mais de um lugar
// const makeEmailValidatorWithError = (): EmailValidator =>{
//     class EmailValidatorStub implements EmailValidator{
//         isValid(email:string):boolean{
//             throw new Error()
//         }
//     }
//     return new EmailValidatorStub
// }

//Para Evitar qualquer dependencia e ficar mudando um teste por um , o ideal é fazer isso para deixar o codigo mais limpo
//Assim eu posso colocar quantas dependenciar eu quiser e não necessariamente preciso mudar em cada parte
const makeSut = ():SutTypes =>{

    //Criando uma variavel recebendo a calsse criado acima especificamente para email
    const emailValidatorStub =  makeEmailValidator()

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
        //Utilizando o jst.spyOn , no qual ele vai espionaro objeto emailValidatorStub
        // No qual vai espionar o metodo "isValid" , mockar o validador, para fazer ele falha , ou seja fazer o teste corretamente em busca do return
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
    //Criando um erro para o Invalid Email
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))

    })

    //Forçando o email ser chamado da forma correta
    test('Should call EmailValidator with correct email',()=>{
        const {sut, emailValidatorStub} = makeSut()
        //Verificando e capturando o email
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
    sut.handle(httpRequest)
    //Esperando que o metodo receba o email da forma correta , se for diferente @mail.com, dará erro
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')

    })

    //Teste trazendo erro do servidor
    test('Should return 500 if EmailValidator throws',()=>{
        
        /* Uma das formas para verificar o erro do Server*/
        // const emailValidatorStub = makeEmailValidatorWithError() 
        // const sut =  new SingUpController(emailValidatorStub); 


        const {sut, emailValidatorStub} = makeSut()


        //Mockar a implementação dele , no qual ele vai ser uma função e vai retornar erro
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(()=>{
            
            throw new Error()
        })

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