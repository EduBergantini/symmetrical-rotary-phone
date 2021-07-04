import { RequiredFieldValidation, EmailFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { IValidation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): IValidation => {
  const validationList: IValidation[] = []

  for (const fieldName of ['email', 'password']) {
    validationList.push(new RequiredFieldValidation(fieldName))
  }
  validationList.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validationList)

  return validationComposite
}
