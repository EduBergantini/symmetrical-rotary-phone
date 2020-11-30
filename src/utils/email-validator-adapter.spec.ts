import { EmailValidatorAdapter } from './email-validator-adapter'

describe('Email Validator Adapter', () => {
  test('should return false if validator fails', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_mail')
    expect(isValid).toBeFalsy()
  })
})
