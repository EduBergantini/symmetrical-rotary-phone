import { IHttpRequest, IAuthentication, IValidation } from './login-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  validationStub: IValidation
  authenticationStub: IAuthentication
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth (email: string, password: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const makeFakeHttpRequest = (): IHttpRequest => ({
  body: {
    email: 'any-email@enterprise.com',
    password: 'any_password'
  }
})

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    validationStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('should call IAuthentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if IAuthentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(error))
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(error))
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('should call IValidation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if IValidation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new Error()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(error))
  })
})
