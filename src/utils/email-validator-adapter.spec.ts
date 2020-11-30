import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('Email Validator Adapter', () => {
  test('should return false if validator fails', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_mail@mail.com')
    expect(isValid).toBeFalsy()
  })

  test('should return true if validation succeed', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_mail@mail.com')
    expect(isValid).toBeTruthy()
  })
})
