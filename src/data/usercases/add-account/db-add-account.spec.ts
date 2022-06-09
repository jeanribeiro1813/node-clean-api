import { DbAddAccount } from './db-add-account';

//Aqui é o processo de recebimento dos dados , se os dados estão validos e passou pelo Controller , aqui iremos receber os dados e fazer os "tratamentos"
describe('DbAddAccount',()=>{
    
    test('Should call Encrypter with correct password', async ()=>{

        class EncrypterStub{
            async encrypt (value:string):Promise<string>{
                return new Promise(resolve => resolve('hashed_password'))
            }
        }
        const encrypterStub = new EncrypterStub();
        const sut = new DbAddAccount(encrypterStub)

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