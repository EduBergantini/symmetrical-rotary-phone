import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailFieldValidation } from '../../../presentation/helpers/validators'
import { IValidation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../main/adapters/validators/email-validator-adapter'

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
