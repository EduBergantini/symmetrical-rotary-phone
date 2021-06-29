import { IController, IHttpRequest, IHttpResponse, IEmailValidator, IAuthentication } from './login-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements IController {
  constructor (
    private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
