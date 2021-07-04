import { ILogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements IController {
  constructor (
    private readonly controller: IController,
    private readonly logRepository: ILogErrorRepository
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
