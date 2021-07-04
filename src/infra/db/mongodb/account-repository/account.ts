import { IAddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoAccountRepository implements IAddAccountRepository, ILoadAccountByEmailRepository {
  async addAccount (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const insertResult = await accountCollection.insertOne(account)
    const mongoAccount = insertResult.ops[0]
    return MongoHelper.map(mongoAccount)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const mongoAccount = await accountCollection.findOne({ email })
    return mongoAccount && MongoHelper.map(mongoAccount)
  }
}
