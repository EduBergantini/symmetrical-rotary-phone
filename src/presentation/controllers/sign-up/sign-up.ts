import { badRequest, serverError, ok } from '../../helpers/http-helper'
import { IValidation } from '../../helpers/validators/validation'
import { IController, IHttpResponse, IHttpRequest,IAddAccount } from './sign-up-protocols'

export class SignUpController implements IController {
  constructor (
    private readonly addAccount: IAddAccount,
    private readonly validation: IValidation
  ) {

  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError(error.stack)
    }
  }
}
