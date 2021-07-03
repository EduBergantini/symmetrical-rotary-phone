import { AccountModel } from '../../../domain/models/account-model'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IHashComparer } from '../../protocols/criptography/hash-comparer'
import { ITokenGenerator } from '../../protocols/criptography/token-generator'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (email: string): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: email,
  password: 'encrypted_password'
})

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
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

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate (value: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new TokenGeneratorStub()
}

const makeFakeAuthenticationModel = (email: string = 'any_email@email.com'): AuthenticationModel => ({
  email,
  password: 'any_password'
})

interface ISutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
  hashComparerStub: IHashComparer
  tokenGeneratorStub: ITokenGenerator
}
const makeSut = (): ISutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()

  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call ILoadAccountByEmailRepository with correct email', async () => {
    const userEmail = 'any_email@email.com'
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthenticationModel(userEmail))
    expect(loadSpy).toHaveBeenCalledWith(userEmail)
  })

  test('Should throw if ILoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return null if ILoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBeNull()
  })

  test('Should call IHashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationModel())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'encrypted_password')
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

  test('Should call ITokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthenticationModel())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if ITokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return an access token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken).toBe('any_token')
  })
})
