import { DbAddAccount } from '../../../data/usecases/AddAccount/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../../presentation/controllers/sign-up/sign-up'
import { IController } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../../decorators/log'

export const makeSignUpController = (): IController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bCryptAdapterSalt = 12
  const encryptAdapter = new BcryptAdapter(bCryptAdapterSalt)
  const addAccountRepository = new MongoAccountRepository()
  const addAccount = new DbAddAccount(encryptAdapter, addAccountRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, addAccount)
  const logController = new LogControllerDecorator(signUpController)
  return logController
}
