import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class TokensController {
  public async cleanup({ response }: HttpContext) {
    const now = DateTime.now().toSQL()

    const deleted = await db
      .from('auth_access_tokens')
      .whereNotNull('expires_at')
      .where('expires_at', '<', now)
      .delete()

    return response.status(200).json({
      message: 'Tokens expirados removidos com sucesso!',
      totalDeleted: deleted,
    })
  }
}
