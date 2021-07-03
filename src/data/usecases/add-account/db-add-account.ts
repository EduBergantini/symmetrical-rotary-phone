import { AccountModel,AddAccountModel, IAddAccount, IAddAccountRepository, IHasher } from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor (
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository
  ) {
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const accountModel = await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
    return Promise.resolve(accountModel)
  }
}
