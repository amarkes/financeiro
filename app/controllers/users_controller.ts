import User from '#models/user'
import { createUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ response }: HttpContext) {
    response.status(404).json({ message: 'Not Found' })
  }
  /**
   * @store
   * @description Create a new user
   * @requestBody {"fullName":"John Doe","email":"johndoe@example.com","password": "teste1","status": "1"}
   * @responseBody 200 - <User[]>
   * @paramUse(sortable, filterable)
   */
  async store({ request, response }: HttpContext) {
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
      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        cpf: data.cpf,
      })
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

  async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = await User.findByOrFail('id', params.id)

      if (auth.user?.id !== user.id) {
        return response.status(403).json({ error: 'Not permission' })
      }

      const payload = request.only(['full_name', 'email', 'password', 'cpf'])

      // Atualiza os campos se fornecidos
      if (payload.full_name !== undefined) user.fullName = payload.full_name
      if (payload.email !== undefined) user.email = payload.email
      if (payload.password !== undefined) user.password = payload.password
      if (payload.cpf !== undefined) user.cpf = payload.cpf

      await user.save()
      return response.status(200).json(user)
    } catch (error) {
      return response.status(400).json({ error: error.message || 'Error updating user' })
    }
  }

  async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = await User.findByOrFail('id', params.id)
      if (auth.user?.id !== user.id) {
        return response.status(403).json({ error: 'Not permission' })
      }
      await user.delete()
      return response.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      return response.status(404).json({ error: 'User not found' })
    }
  }
}
