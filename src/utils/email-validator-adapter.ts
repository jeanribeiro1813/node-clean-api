import { EmailValidator } from '../representation/protocols/email-validator';
import validator  from 'validator'

export class EmailValidatorAdapter implements EmailValidator{

    //Obrigatorio trazer esse metodo pois foi implementado da interface criada para email validator
    isValid(email:string):boolean{
        return validator.isEmail(email)
    }

}