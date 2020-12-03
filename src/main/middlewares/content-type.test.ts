import request from 'supertest'
import app from '../config/app'

describe('Content-Type Middleware', () => {
  test('should return default content type as JSON', async () => {
    const routeName = '/test_json_content_type'
    app.get(routeName, (request, response) => {
      response.send('')
    })
    await request(app)
      .get(routeName)
      .expect('content-type', /json/)
  })

  test('should return XML content type when forced', async () => {
    const routeName = '/test_xml_content_type'
    app.get(routeName, (request, response) => {
      response.type('xml')
      response.send('')
    })
    await request(app)
      .get(routeName)
      .expect('content-type', /xml/)
  })
})
