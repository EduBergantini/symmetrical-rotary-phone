import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('should enable CORS', async () => {
    const routeName = '/test_cors'
    app.post(routeName, (request, response) => {
      response.send()
    })
    await request(app)
      .get(routeName)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
