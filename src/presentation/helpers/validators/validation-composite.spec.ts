import { MissingParamError } from '../../errors'
import { IValidation } from './validation'
import { ValidationComposite } from './validation-composite'

interface ISutTypes {
  sut: ValidationComposite
  validationStubs: IValidation[]
}

const makeSut = (): ISutTypes => {
  const validationStubs = [
    makeValidation(),
    makeValidation()
  ]
  const sut = new ValidationComposite(validationStubs)
  return { sut, validationStubs }
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('Should return the first error when more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const missingParamError = new MissingParamError('any_field')
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(missingParamError)
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(missingParamError)
  })

  test('Should return null when validations succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
