import { AuthenticationModel, IAuthentication } from '../../../domain/usecases/authentication'
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements IAuthentication {
  constructor (
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  ) {}

  async auth (model: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(model.email)
    return ''
  }
}
