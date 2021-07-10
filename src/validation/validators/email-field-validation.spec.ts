import { InvalidParamError, ServerError } from '../../presentation/errors'
import { IHttpRequest } from '../../presentation/protocols'
import { IEmailValidator } from '../protocols/email-validator'
import { EmailFieldValidation } from '../validators/email-field-validation'

interface ISutTypes {
  sut: EmailFieldValidation
  emailValidatorStub: IEmailValidator
}

const makeFakeRequest = (): IHttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): ISutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailFieldValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email field Validation', () => {
  test('should return InvalidParamError if an invalid e-mail is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = sut.validate({ email: 'invalid_email' })
    expect(httpResponse).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    sut.validate(httpRequest.body)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should throw ServerError if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    const errorStub = new Error('Mensagem de Erro Stub')
    console.log('> TESTE')
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw errorStub })
    console.log(`> ERRO: ${errorStub.message}`)
    expect(sut.validate).toThrow(new ServerError(errorStub.message))
  })
})
