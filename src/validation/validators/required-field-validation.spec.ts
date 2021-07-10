import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (fieldName: string): RequiredFieldValidation => {
  return new RequiredFieldValidation(fieldName)
}

describe('Required Field Validation', () => {
  test('Should return MissingParamError if validation fails', () => {
    const fieldName = 'any_field'
    const sut = makeSut(fieldName)
    const error = sut.validate({ })
    expect(error).toEqual(new MissingParamError(fieldName))
  })

  test('Should return null when validation succeeds', () => {
    const sut = makeSut('any_field')
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
