import { Encrypter, AddAccountModel,AccountModel, AddAccountRepository } from './db-add-accout-protocols';
import { DbAddAccount } from './db-add-account';

//Responsavel para fazer os teste de Criptografia 

//Esse encrypter é reponsavel para fazer o teste da Criptografia da senha

const makeEncrypter = (): Encrypter =>{

    class EncrypterStub implements Encrypter{
        async encrypt (value:string):Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository =>{

    class AddAccountRepositoryStub implements AddAccountRepository{
        async add (accountData:AddAccountModel):Promise<AccountModel>{
            const fakeAccount = {
                
            id: 'valid_id'  ,  
            name:'valid_name',
            email: 'valid_email',
            password:'hashed_password'
            }
            return new Promise (resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountRepositoryStub

}



interface SutTypes{
    sut: DbAddAccount
    encrypterStub:Encrypter
    addAccountRepositoryStub: AddAccountRepository
}


const makesut = (): SutTypes =>{

    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAccountRepository()
    const sut = new DbAddAccount(encrypterStub,addAccountRepositoryStub)

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub
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

    test('Should throw if Encrypter throws', async ()=>{

      
        const {sut, encrypterStub} = makesut()

        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve,reject) => reject (new Error())))
        const accountData = {

            name:'valid_name',
            email: 'valid_email',
            password:'valid_password'
        }

        const promise =  sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })

    test('Should call AddAccountRepository if with correct password values', async ()=>{

      
        const {sut, addAccountRepositoryStub} = makesut()

        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
        const accountData = {

            name:'valid_name',
            email: 'valid_email',
            password:'valid_password'
        }

        await sut.add(accountData)
        expect(addSpy).toHaveBeenCalledWith({
            name:'valid_name',
            email: 'valid_email',
            password:'hashed_password'
        })
    })


    test('Should throw if AddAccountRepository throws', async ()=>{

      
        const {sut, addAccountRepositoryStub} = makesut()

        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve,reject) => reject (new Error())))
        const accountData = {

            name:'valid_name',
            email: 'valid_email',
            password:'valid_password'
        }

        const promise =  sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })

    test('Should return an account if on success', async ()=>{

      
        const {sut} = makesut()

        const accountData = {

            name:'valid_name',
            email: 'valid_email',
            password:'valid_password'
        }

       const account =  await sut.add(accountData)
        expect(account).toEqual({
            id:'valid_id',
            name:'valid_name',
            email: 'valid_email',
            password:'hashed_password'
        })
    })

    
})