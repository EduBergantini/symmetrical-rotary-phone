import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailFieldValidation } from '../../../validation/validators'
import { makeSignUpValidation } from './sign-up-validation-factory'
import { IValidation } from '../../../presentation/protocols/validation'
import { IEmailValidator } from '../../../validation/protocols/email-validator'

jest.mock('../../../validation/validators/validation-composite')

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
