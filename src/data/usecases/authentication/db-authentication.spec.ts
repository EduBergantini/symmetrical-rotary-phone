import { AccountModel } from '../../../domain/models/account-model'
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: email,
          password: 'encrypted_password'
        }
        return Promise.resolve(account)
      }
    }

    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepository)
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth({ email: 'any_email@email.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
