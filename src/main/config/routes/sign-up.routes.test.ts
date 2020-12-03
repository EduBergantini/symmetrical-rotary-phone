import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import app from '../app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  test('should return an account on success', async () => {
    const routeName = '/api/sign-up'

    await request(app)
      .post(routeName)
      .send({
        name: 'Meu Nome Completo',
        email: 'meu-email@minha-empresa.com',
        password: '123@Mudar!',
        passwordConfirmation: '123@Mudar!'
      })
      .expect(200)
  })
})
