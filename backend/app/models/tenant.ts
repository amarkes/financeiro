import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'
import { StatusUser } from '../enums/status_user.js'
import User from './user.js'
import { DateTime } from 'luxon'

export default class Tenant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  // @enum(1, 2, 3, 4)
  declare status:
    | string
    | StatusUser.ACTIVE
    | StatusUser.INACTIVE
    | StatusUser.SUSPENDED
    | StatusUser.DELETED

  @column({ columnName: 'user_id' })
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUid(tenant: Tenant) {
    tenant.uuid = uuidv4()
  }

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
