import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('Should return MissingParamError if validation fails', () => {
    const fieldName = 'any_field'
    const sut = new RequiredFieldValidation(fieldName)
    const error = sut.validate({ })
    expect(error).toEqual(new MissingParamError(fieldName))
  })

  test('Should return null when validation succeeds', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
