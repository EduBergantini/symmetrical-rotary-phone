import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/sign-up/sign-up-factory'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/sign-up', adaptRoute(makeSignUpController()))
  router.post('/sign-in', adaptRoute(makeLoginController()))
}
