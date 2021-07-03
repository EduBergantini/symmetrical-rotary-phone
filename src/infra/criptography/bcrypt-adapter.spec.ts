import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash')
  },

  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

describe('BCrypt Adapter', () => {
  test('Should call method hash with correct value', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const testValue = 'any_value'
    await sut.hash(testValue)
    expect(hashSpy).toHaveBeenCalledWith(testValue, salt)
  })

  test('Should return a hash on  method hash success', async () => {
    const sut = makeSut()
    const hashResult = await sut.hash('any_value')
    expect(hashResult).toBe('hash')
  })

  test('Should forward method hash errors', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const hashResult = sut.hash('any_value')
    await expect(hashResult).rejects.toThrow()
  })

  test('Should call method compare with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return true if method compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBeTruthy()
  })

  test('Should return false when method compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const isValid = await sut.compare('any_value', 'any_hash')
    await expect(isValid).toBeFalsy()
  })

  test('should forward method compare errors', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.compare('any_value', 'any_hash')
    await expect(promise).rejects.toThrow()
  })
})
