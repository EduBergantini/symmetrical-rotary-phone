import { Request, Response, Router } from 'express'

export default (router: Router): void => {
  router.post('/sign-up', (request: Request, response: Response) => {
    response.json({ ok: 'ok' })
  })
}
