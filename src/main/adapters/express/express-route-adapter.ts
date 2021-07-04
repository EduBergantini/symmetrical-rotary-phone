import { Request, Response } from 'express'
import { IController, IHttpRequest, IHttpResponse } from '../../../presentation/protocols'

export const adaptRoute = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: IHttpRequest = {
      body: request.body
    }
    const httpResponse: IHttpResponse = await controller.handle(httpRequest)
    response.status(httpResponse.statusCode).send(httpResponse.body)
  }
}
