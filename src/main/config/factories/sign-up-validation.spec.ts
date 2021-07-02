import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './sign-up-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { IValidation } from '../../../presentation/helpers/validators/validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('Signup Validation Factory', () => {
  test('Should call validation composite with all IValidation', () => {
    makeSignUpValidation()

    const validationList: IValidation[] = []

    for (const fieldName of ['name', 'email', 'password', 'passwordConfirmation']) {
      validationList.push(new RequiredFieldValidation(fieldName))
    }
    validationList.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validationList)
  })
})
