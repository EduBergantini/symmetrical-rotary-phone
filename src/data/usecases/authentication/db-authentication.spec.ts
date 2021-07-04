import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  AuthenticationModel,
  ILoadAccountByEmailRepository,
  IUpdateAccessTokenRepository,
  IHashComparer,
  IEncrypter
} from './db-authentication-protocols'

const makeFakeAccount = (email: string): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: email,
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount(email)
      return Promise.resolve(account)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare (value: string, hashedValue: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepositoryStub = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeFakeAuthenticationModel = (email: string = 'any_email@email.com'): AuthenticationModel => ({
  email,
  password: 'any_password'
})

interface ISutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
  hashComparerStub: IHashComparer
  encrypterStub: IEncrypter
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
}
const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call ILoadAccountByEmailRepository with correct email', async () => {
    const userEmail = 'any_email@email.com'
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthenticationModel(userEmail))
    expect(loadSpy).toHaveBeenCalledWith(userEmail)
  })

  test('Should throw if ILoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return null if ILoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBeNull()
  })

  test('Should call IHashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationModel())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if IHashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return null if IHashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBeNull()
  })

  test('Should call IEncrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationModel())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if IEncrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return an access token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBe('any_token')
  })

  test('Should call IUpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthenticationModel())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if IUpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow(new Error())
  })
})
