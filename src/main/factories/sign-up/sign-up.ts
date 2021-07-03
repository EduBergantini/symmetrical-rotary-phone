import { DbAddAccount } from '../../../data/usecases/AddAccount/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../../presentation/controllers/sign-up/sign-up'
import { IController } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidation } from './sign-up-validation'

export const makeSignUpController = (): IController => {
  const bCryptAdapterSalt = 12
  const encryptAdapter = new BcryptAdapter(bCryptAdapterSalt)
  const addAccountRepository = new MongoAccountRepository()
  const addAccount = new DbAddAccount(encryptAdapter, addAccountRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(addAccount, validationComposite)
  const logErrorRepository = new LogErrorMongoRepository()
  const logController = new LogControllerDecorator(signUpController, logErrorRepository)
  return logController
}
