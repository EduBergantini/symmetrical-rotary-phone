import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('Email Validator Adapter', () => {
  test('should return false if validator fails', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_mail@mail.com')
    expect(isValid).toBeFalsy()
  })

  test('should return true if validation succeed', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_mail@mail.com')
    expect(isValid).toBeTruthy()
  })

  test('should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const email = 'valid_mail@mail.com'
    sut.isValid(email)
    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })
})
