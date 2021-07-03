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
  test('should call method hash with correct value', async () => {
    const sut = makeSut()
    const hashSky = jest.spyOn(bcrypt, 'hash')
    const testValue = 'any_value'
    await sut.hash(testValue)
    expect(hashSky).toHaveBeenCalledWith(testValue, salt)
  })

  test('should return a hash on  method hash success', async () => {
    const sut = makeSut()

    const testValue = 'any_value'
    const hashResult = await sut.hash(testValue)
    expect(hashResult).toBe('hash')
  })

  test('should forward method hash errors', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const testValue = 'any_value'
    const hashResult = sut.hash(testValue)
    await expect(hashResult).rejects.toThrow()
  })

  test('should call method compare with correct values', async () => {
    const sut = makeSut()
    const hashSky = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(hashSky).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('should return true if method compare succeeds', async () => {
    const sut = makeSut()
    const hashResult = await sut.compare('any_value', 'any_hash')
    expect(hashResult).toBeTruthy()
  })

  test('should return false when method compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const isValid = await sut.compare('any_value', 'any_hash')
    await expect(isValid).toBeFalsy()
  })
})
