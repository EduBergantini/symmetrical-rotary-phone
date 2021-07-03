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
  }
}))

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const hashSky = jest.spyOn(bcrypt, 'hash')
    const testValue = 'any_value'
    await sut.hash(testValue)
    expect(hashSky).toHaveBeenCalledWith(testValue, salt)
  })

  test('should return a hash on success', async () => {
    const sut = makeSut()

    const testValue = 'any_value'
    const hashResult = await sut.hash(testValue)
    expect(hashResult).toBe('hash')
  })

  test('should forward BCryptAdapter errors', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const testValue = 'any_value'
    const hashResult = sut.hash(testValue)
    await expect(hashResult).rejects.toThrow()
  })
})
