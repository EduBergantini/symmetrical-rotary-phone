import { AccountModel } from '../../domain/models/account-model'

export interface ILoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel>
}
