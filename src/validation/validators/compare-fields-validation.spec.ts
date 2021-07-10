import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'anotherField')
}

describe('Compare Fields Validation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'field', anotherField: 'anotherField' })
    expect(error).toEqual(new InvalidParamError('anotherField'))
  })

  test('Should return null when validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'field', anotherField: 'field' })
    expect(error).toBeFalsy()
  })
})
