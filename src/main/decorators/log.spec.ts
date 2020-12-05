import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: IController
  controllerStub: IController
  mockedResponse: IHttpResponse
  mockedRequest: IHttpRequest
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

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  const mockedRequest = makeMockHttpRequest()
  return {
    sut,
    controllerStub,
    mockedRequest: makeMockHttpRequest(),
    mockedResponse: makeMockHttpResponse(mockedRequest)

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
})
