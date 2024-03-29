import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoAccountRepository } from './account-repository'

const makeSut = (): MongoAccountRepository => {
  return new MongoAccountRepository()
}

let accountCollection: Collection<any>

describe('MongoDB Account Repository', () => {
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
  test('Should return an account on addAccount success', async () => {
    const sut = makeSut()
    const account = await sut.addAccount({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account when loadByEmail succeeds', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null when loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@email.com')
    expect(account).toBeFalsy()
  })

  test('Should update account token when updateAccessToken succeeds', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
    const { _id, accessToken } = result.ops[0]
    expect(accessToken).toBeFalsy()
    await sut.updateAccessToken(_id, 'any_token')
    const mongoAccount = await accountCollection.findOne({ _id })
    expect(mongoAccount).toBeTruthy()
    expect(mongoAccount.accessToken).toBe('any_token')
  })
})
