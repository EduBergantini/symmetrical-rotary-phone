import { AccountModel } from '../../../domain/models/account-model'
import { AddAccountModel, IAddAccount } from '../../../domain/usecases/add-account'
import { IEncrypter } from '../../protocols/encrypter'

export class DbAddAccount implements IAddAccount {
  constructor (private readonly encrypter: IEncrypter) {
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return Promise.resolve(null)
  }
}
