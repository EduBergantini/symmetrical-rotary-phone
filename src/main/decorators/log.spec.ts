import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Controller Decorator', () => {
  test('should call controller handle method', async () => {
    class ControllerStub implements IController {
      async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
        const httpResponse: IHttpResponse = {
          statusCode: 200,
          body: {
            id: 'any_id',
            name: 'any_name',
            email: 'any_email@email.com',
            password: '123@Mudar',
            passwordConfirmation: '123@Mudar'
          }
        }
        return Promise.resolve(httpResponse)
      }
    }
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: '123@Mudar',
        passwordConfirmation: '123@Mudar'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
