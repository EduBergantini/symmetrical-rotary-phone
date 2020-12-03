import request from 'supertest'
import app from '../app'

describe('SignUp Routes', () => {
  test('should return an account on success', async () => {
    const routeName = '/api/sign-up'

    await request(app)
      .post(routeName)
      .send({
        name: 'Meu Nome Completo',
        email: 'meu-email@minha-empresa.com',
        password: '123@Mudar!',
        passwordConfirmation: '123@Mudar!'
      })
      .expect(200)
  })
})
