import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import appEnv from './config/env'

MongoHelper.connect(appEnv.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(appEnv.applicationPort, () => console.log(`Server running at http://localhost:${appEnv.applicationPort}`))
  })
  .catch(console.error)
