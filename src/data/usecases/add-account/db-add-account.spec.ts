import {
  IHasher,
  AddAccountModel,
  AccountModel,
  IAddAccountRepository,
  ILoadAccountByEmailRepository
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }
  const hasherStub = new HasherStub()
  return hasherStub
}

const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeFakeAccountModel = (account: AddAccountModel): AccountModel => ({
  id: 'valid_id',
  name: account.name,
  email: account.email,
  password: 'hashed_value'
})

const makeAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async addAccount (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccountModel(account)
      return Promise.resolve(fakeAccount)
    }
  }
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  return addAccountRepositoryStub
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccountModel({ name: 'any_name', email, password: 'any_password' })
      return Promise.resolve(account)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: IHasher
  addAccountRepositoryStub: IAddAccountRepository
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('DbAddAccount UseCase', () => {
  test('should call IHasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeFakeAddAccountModel()
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should pass IHasher errors forward', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = makeFakeAddAccountModel()
    const accountPromise = sut.add(accountData)
    await expect(accountPromise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'addAccount')
    const accountData = makeFakeAddAccountModel()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_value'
    })
  })

  test('should pass AddAccountRepository errors forward', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'addAccount').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = makeFakeAddAccountModel()
    const accountPromise = sut.add(accountData)
    await expect(accountPromise).rejects.toThrow()
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAddAccountModel()
    const accountModel = await sut.add(accountData)
    expect(accountModel).toEqual(makeFakeAccountModel(accountData))
  })

  test('Should call ILoadAccountByEmailRepository with correct email', async () => {
    const userEmail = 'valid_email'
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAddAccountModel())
    expect(loadSpy).toHaveBeenCalledWith(userEmail)
  })

  test('Should throw if ILoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeAddAccountModel())
    await expect(promise).rejects.toThrow(new Error())
  })
})
