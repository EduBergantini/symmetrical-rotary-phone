import { AuthenticationModel, IAuthentication } from '../../../domain/usecases/authentication'
import { IHashComparer } from '../../protocols/criptography/hash-comparer'
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements IAuthentication {
  constructor (
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer
  ) {}

  async auth (model: AuthenticationModel): Promise<string> {
    const accountModel = await this.loadAccountByEmailRepository.load(model.email)
    if (!accountModel) {
      return null
    }
    await this.hashComparer.compare(model.password, accountModel.password)
    return ''
  }
}
