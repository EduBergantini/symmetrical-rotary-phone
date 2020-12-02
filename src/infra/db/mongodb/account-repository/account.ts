import { IAddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoAccountRepository implements IAddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const insertResult = await accountCollection.insertOne(account)
    const accountModel = insertResult.ops[0]
    const { _id, ...accountWithoutId } = accountModel
    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
