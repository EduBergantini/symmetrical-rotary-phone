import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { IValidation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-field-validation'
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
