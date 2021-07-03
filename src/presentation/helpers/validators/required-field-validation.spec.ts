import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('Should return MissingParamError if validation fails', () => {
    const fieldName = 'any_field'
    const sut = new RequiredFieldValidation(fieldName)
    const error = sut.validate({ })
    expect(error).toEqual(new MissingParamError(fieldName))
  })
})
