import { IValidation } from './validation'
import { ValidationComposite } from './validation-composite'

interface ISutTypes {
  sut: ValidationComposite
  validationStub: IValidation
}

const makeSut = (): ISutTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])
  return { sut, validationStub }
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

describe('Required Field Validation', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })
})
