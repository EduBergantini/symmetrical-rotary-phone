import { IAuthentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'
import { IEmailValidator } from '../sign-up/sign-up-protocols'

export class LoginController implements IController {
  constructor (
    private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return Promise.resolve(badRequest(new MissingParamError('email')))
      } else if (!password) {
        return Promise.resolve(badRequest(new MissingParamError('password')))
      }
      if (!this.emailValidator.isValid(email)) {
        return Promise.resolve(badRequest(new InvalidParamError('email')))
      }

      await this.authentication.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
