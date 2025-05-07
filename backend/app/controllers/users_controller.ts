import User from '#models/user'
import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * @index
   * @description Returns array of users and it's relations
   * @paramQuery page - Actual page - @type(string) @required
   * @paramQuery limit - Limit per page, max 100 - @type(string) @required
   * @paramQuery status - 1, 2, 3, 4 - @type(enum)
   * @paramQuery bloc - All user from bloc - @type(string)
   * @paramQuery email - email from user - @type(string)
   * @paramQuery cpf - cpf from user - @type(string)
   * @responseBody 200 - <User[]>.with(relations)
   * @paramUse(sortable, filterable)
   * @responseHeader 200 - @use(paginated)
   * @responseHeader 200 - X-pages - A description of the header - @example(test)
   */
  async index({ request, response }: HttpContext) {
    const { page, limit, status, email } = request.qs()
    const query = User.query()
    if (status) {
      query.where('status', status)
    }
    if (email) {
      query.where('email', 'like', `%${email}%`)
    }
    const users = await query.paginate(page || 1, Math.min(limit || 10, 100))
    return response.status(200).json(users.toJSON())
  }
  /**
   * @store
   * @description Create a new user
   * @requestBody {"fullName":"John Doe","email":"johndoe@example.com","password": "teste1","cpf": "15245415236","birthDate":"1990-04-04","bloc": "teste","apartment": "teste","phone": "61954958756","gender": "U","tenant": "teste","status": "1","role": "1"}
   * @responseBody 200 - <User[]>
   * @paramUse(sortable, filterable)
   */
  async store({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(createUserValidator)
      const existingUser = await User.query()
        .where((query) => {
          query.where('email', data.email)
        })
        .first()

      if (existingUser) {
        return response.status(400).json({
          error: {
            message: 'Email already in use.',
          },
        })
      }
      const user = await User.create(request.all())
      return response.status(201).json(user)
    } catch (error) {
      return response.status(400).json({ error: error?.messages || 'Error creating user' })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await User.findByOrFail('id', params.id)
      return user
    } catch (error) {
      return response.status(404).json({ error: error.message })
    }
  }

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
