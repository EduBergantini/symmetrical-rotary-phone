import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'
import { IEmailValidator } from '../sign-up/sign-up-protocols'

export class LoginController implements IController {
  constructor (
    private readonly emailValidator: IEmailValidator
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    } else if (!httpRequest.body.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }
    if (!this.emailValidator.isValid(httpRequest.body.email)) {
      return Promise.resolve(badRequest(new InvalidParamError('email')))
    }
  }
}
