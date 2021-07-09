import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account/account-repository'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { SignInController } from '../../../presentation/controllers/sign-in/sign-in-controller'
import { IController } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignInValidation } from './sign-in-validation-factory'

export const makeSignInController = (): IController => {
  const signInValidation = makeSignInValidation()
  const accountMongoRepository = new MongoAccountRepository()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const signInController = new SignInController(signInValidation, dbAuthentication)
  const logMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signInController, logMongoRepository)
}
