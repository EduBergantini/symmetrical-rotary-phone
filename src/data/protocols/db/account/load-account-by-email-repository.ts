import { AccountModel } from '../../../../domain/models/account-model'

export interface ILoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel>
}
