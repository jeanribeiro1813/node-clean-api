import { AccountModel, AddAccountModel } from "../usercases/add-account/db-add-accout-protocols";

export interface AddAccountRepository{
    
    add (accountData:AddAccountModel):Promise<AccountModel>
}