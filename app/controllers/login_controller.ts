import User from '#models/user'
import { createLoginValidator } from '#validators/login'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  /**
   * @store
   * @description Create a new token
   * @requestBody {"email": "johndoe@example.com", "password": "teste1", "remember": true}
   * @responseBody 200 - {}
   * @paramUse(sortable, filterable)
   */
  async store({ request, response }: HttpContext) {
    try {
      const { email, password, remember } = await request.validateUsing(createLoginValidator)
      const user = await User.verifyCredentials(email, password)
      const res = User.accessTokens.create(user, [`1`], {
        expiresIn: remember ? '30d' : '1d',
        name: user?.email,
      })
      return res
      // response.status(200).json(res)
    } catch (error) {
      if (error.messages) {
        return response.status(422).json(error.messages)
      }

      if (error.code === 'E_INVALID_AUTH_UID' || error.code === 'E_INVALID_AUTH_PASSWORD') {
        return response.status(401).json({ error: 'Credenciais inválidas' })
      }
      return response.status(500).json({ error: 'Erro interno', message: error.message })
    }
  }
  async show({ auth }: HttpContext) {
    await auth.check()
    return auth.user
  }
  async destroy({ auth, response }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.status(203)
  }
}
