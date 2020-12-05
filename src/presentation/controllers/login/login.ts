import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../protocols'

export class LoginController implements IController {
  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }
    return Promise.resolve(badRequest(new MissingParamError('password')))
  }
}
