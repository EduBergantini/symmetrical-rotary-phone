import { RequiredFieldValidation, EmailFieldValidation, ValidationComposite } from '../../../validation/validators'
import { IValidation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'

export const makeSignInValidation = (): IValidation => {
  const validationList: IValidation[] = []

  for (const fieldName of ['email', 'password']) {
    validationList.push(new RequiredFieldValidation(fieldName))
  }
  validationList.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validationList)

  return validationComposite
}
