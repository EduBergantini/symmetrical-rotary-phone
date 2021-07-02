import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './sign-up-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { IValidation } from '../../../presentation/helpers/validators/validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('Signup Validation Factory', () => {
  test('Should call validation composite with all IValidation', () => {
    makeSignUpValidation()

    const requiredFieldValidationList: IValidation[] = []

    for (const fieldName of ['name', 'email', 'password', 'passwordConfirmation']) {
      requiredFieldValidationList.push(new RequiredFieldValidation(fieldName))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(requiredFieldValidationList)
  })
})
