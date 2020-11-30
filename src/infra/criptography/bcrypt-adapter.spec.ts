import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('BCrypt Adapter', () => {
  test('should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSky = jest.spyOn(bcrypt, 'hash')
    const testValue = 'any_value'
    await sut.encrypt(testValue)
    expect(hashSky).toHaveBeenCalledWith(testValue, salt)
  })
})
