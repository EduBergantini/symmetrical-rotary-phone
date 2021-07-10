import { ValidationComposite, RequiredFieldValidation, EmailFieldValidation } from '../../../validation/validators'
import { makeSignInValidation } from './sign-in-validation-factory'
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
    makeSignInValidation()

    const validationList: IValidation[] = []

    for (const fieldName of ['email', 'password']) {
      validationList.push(new RequiredFieldValidation(fieldName))
    }
    validationList.push(new EmailFieldValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validationList)
  })
})
