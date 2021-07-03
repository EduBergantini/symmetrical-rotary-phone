import { IValidation } from './validation'
import { ValidationComposite } from './validation-composite'
describe('Required Field Validation', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements IValidation {
      validate (input: any): Error {
        return new Error()
      }
    }

    const sut = new ValidationComposite([new ValidationStub()])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })
})
