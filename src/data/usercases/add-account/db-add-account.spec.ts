import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface SutTypes{
    sut: DbAddAccount;
    encrypterStub:Encrypter
}

const makeEncrypter = (): Encrypter =>{

    class EncrypterStub implements Encrypter{
        async encrypt (value:string):Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub

}

const makesut = (): SutTypes =>{

    const encrypterStub = makeEncrypter();
    const sut = new DbAddAccount(encrypterStub)

    return {
        sut,
        encrypterStub
    }
}

//Aqui é o processo de recebimento dos dados , se os dados estão validos e passou pelo Controller , aqui iremos receber os dados e fazer os "tratamentos"
describe('DbAddAccount',()=>{
    
    test('Should call Encrypter with correct password', async ()=>{

      
        const {sut, encrypterStub} = makesut()

        const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {

            name:'valid_name',
            email: 'valid_email',
            password:'valid_password'
        }

        await sut.add(accountData)
        expect(encrypterSpy).toHaveBeenCalledWith('valid_password')

    })
})