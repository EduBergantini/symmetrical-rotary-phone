import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection<any>

describe('User Access Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Sign Up Route (POST /sign-up)', () => {
    test('should return 200 on sign up success', async () => {
      await request(app)
        .post('/api/sign-up')
        .send({
          name: 'Meu Nome Completo',
          email: 'meu-email@minha-empresa.com',
          password: '123@Mudar!',
          passwordConfirmation: '123@Mudar!'
        })
        .expect(200)
    })
  })

  describe('Sign In Route (POST /sign-in)', () => {
    test('should return 200 on sign in success', async () => {
      const password = '123@Mudar!'
      const hashedPassword = await hash(password, 12)

      await accountCollection.insertOne({
        name: 'Meu Nome Completo',
        email: 'meu-email@minha-empresa.com',
        password: hashedPassword
      })

      await request(app)
        .post('/api/sign-in')
        .send({
          email: 'meu-email@minha-empresa.com',
          password
        })
        .expect(200)
    })
  })
})
