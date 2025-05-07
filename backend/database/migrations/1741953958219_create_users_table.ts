import { BaseSchema } from '@adonisjs/lucid/schema'
import { StatusUser } from '../../app/enums/status_user.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable()
      table.string('password').notNullable()
      table.string('cpf').nullable()
      table
        .enum('status', [
          StatusUser.ACTIVE,
          StatusUser.INACTIVE,
          StatusUser.SUSPENDED,
          StatusUser.DELETED,
        ])
        .notNullable()
        .defaultTo(StatusUser.ACTIVE)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
