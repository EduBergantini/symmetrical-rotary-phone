import { ILogErrorRepository } from '../../../../data/protocols/db/log/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorMongoRepository } from './log-repository'

const makeSut = (): ILogErrorRepository => {
  return new LogErrorMongoRepository()
}

describe('MongoDB Log Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  test('should create an error on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const errorCollection = await MongoHelper.getCollection('errors')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
