import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { IValidation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): IValidation => {
  const requiredFieldValidationList: IValidation[] = []

  for (const fieldName of ['name', 'email', 'password', 'passwordConfirmation']) {
    requiredFieldValidationList.push(new RequiredFieldValidation(fieldName))
  }

  const validationComposite = new ValidationComposite(requiredFieldValidationList)

  return validationComposite
}
