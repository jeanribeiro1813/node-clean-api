import {SingUpController} from './singup'
import {MissingParamsError} from '../errors/missing-params-error'


const makeSut = ():SingUpController =>{
    return new SingUpController();
}

describe('SingUp Controller',() =>{
    test('Should return 400 if no name is provided',()=>{
        const sut = makeSut()
        const httpRequest = {
            body:{
                email:'any_email',
                password:'any_password',
                passwordConfirmation: 'any_password'
            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('name'))

    })

    test('Should return 400 if no email is provided',()=>{
        const sut = new SingUpController()
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
        const sut = makeSut()
        const httpRequest = {
            body:{
                name:'any_name',
                email:'any_email',
                passwordConfirmation: 'any_password'
            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))

    })

    test('Should return 400 if no password confirmation is provided',()=>{
        const sut = makeSut()
        const httpRequest = {
            body:{
                name:'any_name',
                email:'any_email',
                password: 'any_password'
            }
        }
    const httpResponse =  sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('passwordConfirmation'))

    })
})