import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

describe('Login Controller', () => {
  test('should return 400 if no e-mail is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: '123@Mudar'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
