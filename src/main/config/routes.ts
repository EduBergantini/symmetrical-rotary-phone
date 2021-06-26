import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routesFilePath = `${__dirname}/routes/**routes.ts`.replace(/\\/g, '/')
  fg.sync(routesFilePath).map(async (file) => (await import(file)).default(router))
}
