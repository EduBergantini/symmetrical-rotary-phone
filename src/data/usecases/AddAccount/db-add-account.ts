import { AccountModel,AddAccountModel, IAddAccount, IEncrypter } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor (private readonly encrypter: IEncrypter) {
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return Promise.resolve(null)
  }
}
