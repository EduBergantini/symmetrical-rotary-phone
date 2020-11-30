import { IEncrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: IEncrypter
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }
  const encrypterStub = new EncrypterStub()
  return encrypterStub
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut, encrypterStub
  }
}

describe('DbAddAccount UseCase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('should pass forward any error', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const accountPromise = sut.add(accountData)
    await expect(accountPromise).rejects.toThrow()
  })
})
