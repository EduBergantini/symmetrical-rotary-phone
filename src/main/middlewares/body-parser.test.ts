import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('should parse body as json', async () => {
    const routeName = '/test_body_parser'
    app.post(routeName, (request, response) => {
      response.send(request.body)
    })
    await request(app)
      .post(routeName)
      .send({ name: 'Eduardo' })
      .expect({ name: 'Eduardo' })
  })
})
