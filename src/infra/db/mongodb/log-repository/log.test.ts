import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorMongoRepository } from './log'

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
    const sut = new LogErrorMongoRepository()
    await sut.logError('any_error')
    const errorCollection = await MongoHelper.getCollection('errors')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
