import { AccountModel } from '../../domain/models/account-model'
import { AddAccountModel } from '../../domain/usecases/add-account'

export interface IAddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
