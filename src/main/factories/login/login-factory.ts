import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account/account-repository'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log/log-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { IController } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): IController => {
  const loginValidation = makeLoginValidation()
  const accountMongoRepository = new MongoAccountRepository()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(loginValidation, dbAuthentication)
  const logMongoRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
