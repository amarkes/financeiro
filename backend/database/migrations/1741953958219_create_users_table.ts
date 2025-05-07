import { BaseSchema } from '@adonisjs/lucid/schema'
import { StatusUser } from '../../app/enums/status_user.js'
import { Role } from '../../app/enums/rules.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable()
      table.string('password').notNullable()

      table.string('bloc').notNullable()
      table.string('apartment').notNullable()
      table.string('phone').notNullable()
      table.string('gender').nullable()
      table.date('birth_date').nullable()
      table.string('cpf').nullable()
      table.string('tenant').notNullable()
      table
        .enum('status', [
          StatusUser.ACTIVE,
          StatusUser.INACTIVE,
          StatusUser.SUSPENDED,
          StatusUser.DELETED,
        ])
        .notNullable()
        .defaultTo(StatusUser.ACTIVE)
      table
        .enum('role', [
          Role.ADMIN,
          Role.DIRECTOR,
          Role.MANAGER,
          Role.GESTOR,
          Role.FRONTDESK,
          Role.MARKET,
          Role.FINANCIAL,
          Role.SALES,
          Role.INSTRUCTOR,
          Role.MEMBER,
        ])
        .notNullable()
        .defaultTo(Role.MEMBER)

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
