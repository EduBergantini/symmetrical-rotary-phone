import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailFieldValidation } from '../../../presentation/helpers/validators'
import { makeSignUpValidation } from './sign-up-validation-factory'
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
    makeSignUpValidation()

    const validationList: IValidation[] = []

    for (const fieldName of ['name', 'email', 'password', 'passwordConfirmation']) {
      validationList.push(new RequiredFieldValidation(fieldName))
    }
    validationList.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validationList.push(new EmailFieldValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validationList)
  })
})
