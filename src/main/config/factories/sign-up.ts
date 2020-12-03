import { DbAddAccount } from '../../../data/usecases/AddAccount/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account-repository/account'
import { SignUpController } from '../../../presentation/controllers/sign-up/sign-up'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bCryptAdapterSalt = 12
  const encryptAdapter = new BcryptAdapter(bCryptAdapterSalt)
  const addAccountRepository = new MongoAccountRepository()
  const addAccount = new DbAddAccount(encryptAdapter, addAccountRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, addAccount)
  return signUpController
}
