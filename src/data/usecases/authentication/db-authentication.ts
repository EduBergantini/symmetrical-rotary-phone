import { AuthenticationModel, IAuthentication } from '../../../domain/usecases/authentication'
import { ILoadAccountByEmailRepository, IUpdateAccessTokenRepository, IHashComparer, IEncrypter } from './db-authentication-protocols'

export class DbAuthentication implements IAuthentication {
  constructor (
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
    private readonly encrypter: IEncrypter,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {}

  async auth (model: AuthenticationModel): Promise<string> {
    const accountModel = await this.loadAccountByEmailRepository.loadByEmail(model.email)
    if (!accountModel) {
      return null
    }
    const isValidPassword = await this.hashComparer.compare(model.password, accountModel.password)
    if (!isValidPassword) {
      return null
    }
    const accessToken = await this.encrypter.encrypt(accountModel.id)
    await this.updateAccessTokenRepository.updateAccessToken(accountModel.id, accessToken)
    return accessToken
  }
}
