import { InvalidParamError, ServerError } from '../../presentation/errors'
import { IEmailValidator } from '../protocols/email-validator'
import { IValidation } from '../../presentation/protocols'

export class EmailFieldValidation implements IValidation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: IEmailValidator
  ) {
  }

  validate (input: any): Error {
    try {
      if (!this.emailValidator.isValid(input[this.fieldName])) {
        return new InvalidParamError(this.fieldName)
      }
      return null
    } catch (error) {
      throw new ServerError(error)
    }
  }
}
