import { ILogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: IController
  controllerStub: IController
  mockedResponse: IHttpResponse
  mockedRequest: IHttpRequest
  logErrorRepositoryStub: ILogErrorRepository
}

const makeMockHttpRequest = (): IHttpRequest => {
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@email.com',
      password: '123@Mudar',
      passwordConfirmation: '123@Mudar'
    }
  }
  return httpRequest
}

const makeMockHttpResponse = (httpRequest: IHttpRequest): IHttpResponse => {
  const httpResponse: IHttpResponse = {
    statusCode: 200,
    body: {
      id: 'any_id',
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    }
  }
  return httpResponse
}

const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const httpResponse: IHttpResponse = makeMockHttpResponse(httpRequest)
      return Promise.resolve(httpResponse)
    }
  }
  const controllerStub = new ControllerStub()
  return controllerStub
}

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log (errorStack: string): Promise<void> {
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  const mockedRequest = makeMockHttpRequest()
  return {
    sut,
    controllerStub,
    mockedRequest: makeMockHttpRequest(),
    mockedResponse: makeMockHttpResponse(mockedRequest),
    logErrorRepositoryStub

  }
}

describe('Log Controller Decorator', () => {
  test('should call controller handle method', async () => {
    const { sut, controllerStub, mockedRequest } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = mockedRequest
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of the signature controller handle method', async () => {
    const { sut, mockedRequest, mockedResponse } = makeSut()
    const httpRequest = mockedRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(mockedResponse)
  })

  test('should should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub, mockedRequest } = makeSut()
    const fakeError = new Error('any_message')
    fakeError.stack = 'any_stack'
    const serverErrorResult = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(serverErrorResult))
    const httpRequest = mockedRequest
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
  })
})
