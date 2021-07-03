import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { IValidation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-field-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): IValidation => {
  const validationList: IValidation[] = []

  for (const fieldName of ['name', 'email', 'password', 'passwordConfirmation']) {
    validationList.push(new RequiredFieldValidation(fieldName))
  }
  validationList.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validationList.push(new EmailFieldValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validationList)

  return validationComposite
}
