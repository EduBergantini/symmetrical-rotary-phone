import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeLoginValidation } from './login-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-field-validation'
import { IValidation } from '../../../presentation/protocols/validation'
import { IEmailValidator } from '../../../presentation/protocols/email-validator'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('Signup Validation Factory', () => {
  const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    return new EmailValidatorStub()
  }

  test('Should call validation composite with all IValidation', () => {
    makeLoginValidation()

    const validationList: IValidation[] = []

    for (const fieldName of ['email', 'password']) {
      validationList.push(new RequiredFieldValidation(fieldName))
    }
    validationList.push(new EmailFieldValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validationList)
  })
})
