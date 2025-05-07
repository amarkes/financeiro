/* eslint-disable prettier/prettier */
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, beforeUpdate, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { StatusUser } from '../enums/status_user.js'
import { HttpContext } from '@adonisjs/core/http'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare cpf: string | null

  @column()
  // @enum(1, 2, 3, 4)
  declare status: string | StatusUser.ACTIVE | StatusUser.INACTIVE | StatusUser.SUSPENDED | StatusUser.DELETED

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column({ columnName: 'created_by' })
  declare createdBy: number | null

  @column({ columnName: 'updated_by' })
  declare updatedBy: number | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
  @beforeCreate()
  static async setCreatedBy(user: User, ctx?: HttpContext) {
    const currentUserId = ctx?.auth?.user?.id

    user.createdBy = currentUserId ?? null
    user.updatedBy = currentUserId ?? null
  }

  @beforeUpdate()
  static async setUpdatedBy(user: User, ctx?: HttpContext) {
    const currentUserId = ctx?.auth?.user?.id
    user.updatedBy = currentUserId ?? user.createdBy ?? user.id
  }
}
