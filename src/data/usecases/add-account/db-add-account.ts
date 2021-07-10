import {
  AccountModel,
  AddAccountModel,
  IAddAccount,
  IAddAccountRepository,
  ILoadAccountByEmailRepository, IHasher
} from './db-add-account-protocols'

export class DbAddAccount implements IAddAccount {
  constructor (
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  ) {
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(account.email)
    const hashedPassword = await this.hasher.hash(account.password)
    const accountModel = await this.addAccountRepository.addAccount(Object.assign({}, account, { password: hashedPassword }))
    return Promise.resolve(accountModel)
  }
}
