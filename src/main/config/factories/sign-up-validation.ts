import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { IValidation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): IValidation => {
  const validationList: IValidation[] = []

  for (const fieldName of ['name', 'email', 'password', 'passwordConfirmation']) {
    validationList.push(new RequiredFieldValidation(fieldName))
  }
  validationList.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  const validationComposite = new ValidationComposite(validationList)

  return validationComposite
}
