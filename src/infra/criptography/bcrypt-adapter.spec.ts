import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash')
  }
}))

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSky = jest.spyOn(bcrypt, 'hash')
    const testValue = 'any_value'
    await sut.encrypt(testValue)
    expect(hashSky).toHaveBeenCalledWith(testValue, salt)
  })

  test('should return a hash on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const testValue = 'any_value'
    const hashResult = await sut.encrypt(testValue)
    expect(hashResult).toBe('hash')
  })
})
