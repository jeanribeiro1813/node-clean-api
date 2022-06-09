import { AddAccount, AddAccountModel,Encrypter ,AccountModel, AddAccountRepository} from './db-add-accout-protocols';

export class DbAddAccount implements AddAccount{

    private readonly encrypter :Encrypter
    private readonly addAccountRepository :AddAccountRepository

    
    constructor(encrypter:Encrypter, addAccountRepository:AddAccountRepository){
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepository

    }

    async add(accountData:AddAccountModel):Promise<AccountModel>{

        const hashPassword = await this.encrypter.encrypt(accountData.password)

        await this.addAccountRepository.add(Object.assign({},accountData, {password : hashPassword }))

        return new Promise(resolve =>resolve(null))
    }


}