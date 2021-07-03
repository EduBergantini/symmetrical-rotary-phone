import { AccountModel,AddAccountModel, IAddAccount, IAddAccountRepository, IEncrypter } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor (
    private readonly encrypter: IEncrypter,
    private readonly addAccountRepository: IAddAccountRepository
  ) {
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(account.password)
    const accountModel = await this.addAccountRepository.add(Object.assign({}, account, { password: encryptedPassword }))
    return Promise.resolve(accountModel)
  }
}
